const express = require('express');
const router = express.Router();
const { saveMessage, getMessages, newConversation } = require('../db');
const { ChatOllama } = require("@langchain/ollama");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");

const llm = new ChatOllama({
    model: "llama3",
    temperature: 0,
    maxRetries: 2
});

let history = []; 

const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful chatbot asssistant. Answer questions to the best of your ability."],
    new MessagesPlaceholder("messages")
]);

const chain = promptTemplate.pipe(llm);

router.post('/ask', async (req, res) => {
    const { query, conversation_id } = req.body;

    let fullResponse = '';
    history.push(new HumanMessage(query));
    const data = await chain.stream({messages: history});
    for await (const chunk of data){
        res.write(chunk.content);
        fullResponse += chunk.content;
    }

    try{
        await saveMessage(conversation_id, 'user', query);
        await saveMessage(conversation_id, 'bot', fullResponse);
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

module.exports = router;