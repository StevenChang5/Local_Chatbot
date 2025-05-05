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

    // const promptValue = await promptTemplate.invoke({text : query});
    history.push(new HumanMessage(query));
    const data = await chain.invoke({messages: history});

    try{
        await saveMessage(conversation_id, 'user', query);
        await saveMessage(conversation_id, 'bot', data.content);
        history.push(new AIMessage(data.content));
    }catch(err){
        console.error('Error inserting conversations:',err);
        res.status(500).json({ error: 'Failed to insert conversations' });
    }

    try{
        const result = await getMessages(conversation_id);
        res.json(result);
    }catch(err){
        console.error('Error fetching conversations:',err);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
    
});

router.get('/history/:conversationId', async (req, res) => {
    const conversationId = req.params.conversationId;
    try{
        const result = await getMessages(conversationId);
        history.length = 0;
        for(let i = 0; i < result.length; i++){
            if(result[i].sender == 'user'){
                history.push(new HumanMessage(result[i].message));
            }else{
                history.push(new AIMessage(result[i].message));
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
   
    const titleData = await llm.invoke([
        "system",
        `Generate a title for the following query that summarizes 
        the topic of the query. The title should be short and only 
        a few words. Do not put the title in quotations. \n` + query,
    ]);

    const title = titleData.content;
    const conversation_id = await newConversation(profile.id, title);

    history.push(new HumanMessage(query));
    const responseData = await chain.invoke({messages: history});

    try{
        await saveMessage(conversation_id, 'user', query);
        await saveMessage(conversation_id, 'bot', responseData.content);
        history.push(new AIMessage(responseData.content));
    }catch(err){
        console.error('Error inserting conversations:',err);
        res.status(500).json({ error: 'Failed to insert conversations' });
    }

    try{
        const result = await getMessages(conversation_id);
        res.json({history: result, conversation_id: conversation_id});
    }catch(err){
        console.error('Error fetching conversations:',err);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }

});

module.exports = router;