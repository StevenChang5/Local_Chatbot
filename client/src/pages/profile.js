import {useEffect, useState} from 'react';
import ChatSidebar from '../components/sidebar';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [activeConversationId, setActiveConversationId] = useState(null);
    
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
        e.preventDefault();
        const res = await fetch('http://localhost:8080/chat/ask',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ query: query })
        });
        const data = await res.json();
        setResponse(data.response);
    };

    if(!profile) return <p>Loading profile</p>;

    return (
        <div>
            <ChatSidebar
                userId={profile.id}
                onSelectConversation={(id) => setActiveConversationId(id)}
            />
            <h1>Welcome {profile.id} to your profile!</h1>
            <form onSubmit={handleQuery}>
                <input type="text" placeholder="Ask a question..." onChange={e=>setQuery(e.target.value)} required />
                <button type="submit">Send Query</button>
            </form>
            {response && <p>{response}</p>}
        </div>
    );
};

export default Profile;