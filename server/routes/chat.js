const express = require('express');
const router = express.Router();
const { saveMessage, getMessages, newConversation, insertEmbedding, getEmbedding } = require('../db');
const { ChatOllama } = require("@langchain/ollama");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: 'uploads/ '});

const llm = new ChatOllama({
    model: "llama3",
    baseUrl: "http://ollama:11434",
    temperature: 0,
    maxRetries: 2
});

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
});

let history = []; 

const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful chatbot asssistant. Answer questions to the best of your ability."],
    ["system", "Context: {context}"],
    new MessagesPlaceholder("history"),
    ["human", "{query}"]
]);

const chain = promptTemplate.pipe(llm);

router.post('/ask', async (req, res) => {
    const { query, conversation_id } = req.body;

    const embedding = await getEmbedding(query, conversation_id);
    console.log("Embedding:", embedding);
    let fullResponse = '';
    if(embedding.length == 0){
        const data = await chain.stream({
            history: history,
            context: "",
            query: query
        });
        for await (const chunk of data){
            res.write(chunk.content);
            fullResponse += chunk.content;
        }
    }else{
        const data = await chain.stream({
            history: history,
            context: embedding[0].pageContent,
            query: query
        });
        for await (const chunk of data){
            res.write(chunk.content);
            fullResponse += chunk.content;
        }
    }
    

    try{
        await saveMessage(conversation_id, 'user', query);
        await saveMessage(conversation_id, 'bot', fullResponse);
        history.push(new HumanMessage(query));
        history.push(new AIMessage(fullResponse));
    }catch(err){
        console.error('Error inserting conversations:',err);
    }
    
});

router.get('/history/:conversationId', async (req, res) => {
    const conversationId = req.params.conversationId;
    try{
        const result = await getMessages(conversationId);
        history.length = 0;
        for(let i = 0; i < result.length; i++){
            if(result[i].sender == 'user'){
                history.push(new HumanMessage(result[i].msg));
            }else{
                history.push(new AIMessage(result[i].msg));
            }
        }
        res.json(result);
    }catch(err){
        console.error('Error fetching conversations:',err);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
})

router.post('/newConversation', async(req,res) => {
    const { query, profile } = req.body;
    console.log(`Starting new conversation with ${profile.id}`)
    history.length = 0;
    const titleData = await llm.invoke([
        "system",
        `Generate a title for the following query that summarizes 
        the topic of the query. The title should be short and only 
        a few words. Do not put the title in quotations. \n` + query,
    ]);

    const title = titleData.content;
    try{
        const conversation_id = await newConversation(profile.id, title);
        res.json({conversation_id: conversation_id});
    }catch(err){
        console.error('Error creating new conversation:',err);
        res.status(500).json({error : 'Failed to create new conversation'});
    }
});

router.post('/rag/pdf', upload.single('file'), async(req,res) => {
    try{
        const { conversation_id } = req.body;
        const file = req.file;

        const filePath = path.resolve(file.path);
        const loader = new PDFLoader(filePath);
        console.log("Embedding File:", file.originalname);

        const docs = await loader.load();
        for(let i = 0; i < docs.length; i++){
            docs[i].metadata["conversation"] = conversation_id;
        }
        const allSplits = await splitter.splitDocuments(docs);
        console.log(`Split document into ${allSplits.length} sub-documents.`);
        await insertEmbedding(allSplits);
        res.json({ success: true, message: 'File uploaded successfully' });
    }catch(err){
        console.error("Error:", err);
        res.status(500).json({error: 'Failed to upload PDF'});
    }
});

module.exports = router;