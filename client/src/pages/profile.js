import {useEffect, useState} from 'react';
import ChatSidebar from '../components/sidebar';
import './profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [query, setQuery] = useState('');
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [refreshSidebar, setRefreshSidebar] = useState(false); 
    const [selectedFile, setSelectedFile] = useState(null);

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
        .catch((err) => {
            console.log("Error: ", err);
            localStorage.removeItem('token');
            window.location.href = '/';
        })
    }, []);

    const handleQuery = async (e) => {
        console.log("Question asked...");
        if(selectedFile != null){
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("conversation_id", activeConversationId);
            console.log("Uploading PDF file...");
            fetch('http://localhost:8080/chat/rag/pdf',{
                method: 'POST',
                body: formData
            })
            .then(res => console.log(res.message)
            )
            .catch((err) => {
                console.error('Failed to upload file:', err);
            });
            setSelectedFile(null);
    
        }
        e.preventDefault();
        history.unshift({conversation_id: activeConversationId, sender: "user", msg: input});
        setInput('');
        const response = fetch('http://localhost:8080/chat/ask',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ query: query, conversation_id: activeConversationId})
        });

        const reader = (await response).body.getReader();
        const decoder = new TextDecoder();
        let streamedMessage = { conversation_id: activeConversationId, sender: "bot", msg: '' };

        while(true){
            const { value, done } = await reader.read();
            if(done) break;
            const chunk = decoder.decode(value, {stream:true});
            streamedMessage.msg += chunk
            setHistory(prev=>[streamedMessage, ...prev.filter(msg=>msg!==streamedMessage)]);
        }
    };

    const displayHistory = (id) =>{
        if(id === ""){
            setActiveConversationId(null);
            setHistory([]);
        }else{
            fetch(`http://localhost:8080/chat/history/${id}`)
            .then(res => res.json())
            .then(data => {
                setHistory(data);
                setActiveConversationId(id);
            })
            .catch(err => console.error('Failed to fetch conversations:', err));
        }
    };

    const newConversation = async (e) => {
        console.log("New Conversation");
        e.preventDefault();
        history.unshift({conversation_id: activeConversationId, sender: "user", msg: input});
        const tempQuery = input;
        setInput('');
        try{
            const res = await fetch('http://localhost:8080/chat/newConversation',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ query: query, profile: profile})
            })
            const data = await res.json();
            setRefreshSidebar(prev=>!prev);
            setActiveConversationId(data.conversation_id);
            
            const response = await fetch('http://localhost:8080/chat/ask',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ query: tempQuery, conversation_id: data.conversation_id})
            });
    
            const reader = (await response).body.getReader();
            const decoder = new TextDecoder();
            let streamedMessage = { conversation_id: data.conversation_id, sender: "bot", msg: '' };
    
            while(true){
                const { value, done } = await reader.read();
                if(done) break;
                const chunk = decoder.decode(value, {stream:true});
                streamedMessage.msg += chunk
                setHistory(prev=>[streamedMessage, ...prev.filter(msg=>msg!==streamedMessage)]);
            }
        }catch(err){
            console.error('Failed to create new conversation:', err);
        }   
    };

    const handleFileUpload = (event) => {
        console.log("Uploaded file");
        setSelectedFile(event.target.files[0]);
    };

    if(!profile) return <p>Loading profile</p>;

    return (
        <div className='profile-container'>
            <ChatSidebar
                userId={profile.id}
                onSelectConversation={(id) => {
                        displayHistory(id);
                    }
                }
                refreshSignal={refreshSidebar}
            />
            <div className='main-content'>
                <h2 className="chat-title;">Current conversation: {activeConversationId}</h2>
                    <div className="chat-history">
                        {history.map((msg,idx) => (
                            <div key={idx} className={`message-container ${msg.sender}`}>
                                <p className="message-text">{msg.msg}</p>
                            </div>
                        ))}
                    </div>
                <form className="form-query" onSubmit={activeConversationId ? handleQuery : newConversation}>
                    <input 
                        class="input"
                        type="text" 
                        value={input}
                        placeholder="Ask a question..." 
                        onChange={e=>{
                                setQuery(e.target.value);
                                setInput(e.target.value);
                            }
                        } 
                        required />
                    <input type="file" onChange={handleFileUpload}/>
                    <button type="submit" className="submit-button">
                        <img className="submit-button-symbol" src="/static/query.png" alt="Submit" />
                    </button>
                </form>
            </div>
            
        </div>
    );
};

export default Profile;