import { useState, useEffect } from 'react';
import './sidebar.css';

function ChatSidebar({ userId, onSelectConversation, refreshSignal }){
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8080/profile/conversations/${userId}`)
        .then(res => res.json())
        .then(data => setConversations(data))
        .catch(err => console.error('Failed to fetch conversations:', err));
    }, [userId]);

    useEffect(() => {
        if(refreshSignal){
            fetch(`http://localhost:8080/profile/conversations/${userId}`)
            .then(res => res.json())
            .then(data => setConversations(data))
            .catch(err => console.error('Failed to fetch conversations:', err));
        }
    })

    return(
        <div className="sidebar">
            <div className="section-title">Past Chats</div>
            <div className="conversation-list">
                {conversations.map(conv => (
                    <button
                    key={conv.id}
                    onClick={() => onSelectConversation(conv.id, conv.title)}
                    className="conversation-button"
                    >
                    {conv.title || 'Untitled Chat'}
                    </button>
                ))}
            </div>
            
            <button key={""} onClick={() => onSelectConversation("")} className="new-chat-button">
                <img className="new-chat-symbol" src="/static/new_chat.png" alt="New Chat"/>
                <span>New Chat</span>
            </button>
        </div>
    );
};

export default ChatSidebar;