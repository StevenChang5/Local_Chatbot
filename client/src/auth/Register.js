import { useState } from 'react';
import { Link } from 'react-router';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:8080/auth/register',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email,password})
        });
        const data = await res.json();
        setMessage(data.message);
    };

    return(
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input type="email" placeholder="Email" onChange={e=>setEmail(e.target.value)} required/>
                <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} required/>
                <button type="submit">Register</button>
            </form>
            <Link to="/login">
                <button>
                    Have an account? Sign in
                </button>
            </Link>
            {message && <p>{message}</p>}
        </div>
    )
}