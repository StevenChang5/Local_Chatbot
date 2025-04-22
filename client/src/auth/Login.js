import { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:8080/auth/login',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email,password})
        });
        const data = await res.json();
        setMessage(data.message);
    }

    return(
        <div>
            <h2>Login</h2>
            <form onSubmit={handleRegister}>
                <input type="email" placeholder="Email" onChange={e=>setEmail(e.target.value)} required/>
                <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} required/>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}