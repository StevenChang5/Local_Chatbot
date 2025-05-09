import { useState } from 'react';
import { Link } from 'react-router';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:8080/auth/login',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email,password})
        });
        const data = await res.json();
        if(data.token){
            localStorage.setItem('token', data.token);
            window.location.href = '/profile';
        }
        setMessage(data.message);
    }

    return(
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" onChange={e=>setEmail(e.target.value)} required/>
                <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} required/>
                <button type="submit">Login</button>
            </form>
            <Link to="/register">
                <button>
                    Create a new account
                </button>
            </Link>
            {message && <p>{message}</p>}
        </div>
    )
}