import { useState, useEffect } from 'react';

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
        <div className="w-64 h-full bg-gray-100 p-4 overflow-y-auto border-r">
            <h2 className="text-lg font-semibold mb-4">Past Chats</h2>
            {conversations.map(conv => (
                <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className="block w-full text-left py-2 px-3 rounded hover:bg-gray-200"
                >
                {conv.title || 'Untitled Chat'}
                </button>
            ))}
        </div>
    );
};

export default ChatSidebar;