import {useEffect, useState} from 'react';
import ChatSidebar from '../components/sidebar';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [query, setQuery] = useState('');
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [refreshSidebar, setRefreshSidebar] = useState(false); 
    
    useEffect(() => {
        const token = localStorage.getItem('token');

        if(!token){
            window.location.href ='/';
            return;
        }

        fetch('http://localhost:8080/profile/main_profile',{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => setProfile(data))
        .catch(() => {
            localStorage.removeItem('token');
            window.location.href = '/';
        })
    }, []);

    const handleQuery = async (e) => {
        console.log("Follow up question");
        e.preventDefault();
        history.unshift({conversation_id: activeConversationId, sender: "user", message: input});
        setInput('');
        fetch('http://localhost:8080/chat/ask',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ query: query, conversation_id: activeConversationId})
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setHistory(data);
        })
        .catch(err => console.error('Failed to query chatbot:', err));
    };

    const displayHistory = (id) =>{
        if(id === ""){
            setActiveConversationId(null);
            setHistory([]);
        }else{
            fetch(`http://localhost:8080/chat/history/${id}`)
            .then(res => res.json())
            .then(data => setHistory(data))
            .catch(err => console.error('Failed to fetch conversations:', err));
            setActiveConversationId(id);
        }
    }

    const newConversation = async (e) => {
        console.log("New Conversation");
        e.preventDefault();
        history.unshift({conversation_id: activeConversationId, sender: "user", message: input});
        setInput('');
        fetch('http://localhost:8080/chat/newConversation',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ query: query, profile: profile})
        })
        .then(res => res.json())
        .then(data => {
            setRefreshSidebar(prev => !prev);
            setHistory(data.history);
            setActiveConversationId(data.conversation_id);
        })
        .catch(err => console.error('Failed to create new conversation:', err));
    }

    if(!profile) return <p>Loading profile</p>;

    return (
        <div>
            <ChatSidebar
                userId={profile.id}
                onSelectConversation={(id) => {
                        displayHistory(id);
                    }
                }
                refreshSignal={refreshSidebar}
            />
            <h1>Welcome {profile.id} to your profile!</h1>
            <h2>Current conversation: {activeConversationId}</h2>
            <div>
                <h2>Conversation #{activeConversationId}</h2>
                <div style={{display: 'flex', flexDirection: 'column-reverse'}}>
                    {history.map((msg,idx) => (
                        <div key={idx}>
                            <p>{msg.sender}: {msg.message}</p>
                        </div>
                    ))}
                </div>
            </div>
                
            <form onSubmit={activeConversationId ? handleQuery : newConversation}>
                <input 
                    type="text" 
                    value={input}
                    placeholder="Ask a question..." 
                    onChange={e=>{
                            setQuery(e.target.value);
                            setInput(e.target.value);
                        }
                    } 
                    required />
                <button type="submit">Send Query</button>
            </form>
        </div>
    );
};

export default Profile;