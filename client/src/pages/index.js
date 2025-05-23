import React from 'react';
import { Link } from 'react-router';
import './index.css';

const Home = () => {
    return (
        <div className='main-container'>
            <div className='start'>
                <div className='big-header'>Welcome to Local Chatbot!</div>
                <div className='content'>
                    Your personal asssistant, with RAG support. Fast and secure. Ask away.
                </div>
                <Link to="/login">
                    <button className='button-link'>
                        Get Started
                    </button>
                </Link>
            </div>
            
        </div>
    );
};

export default Home;
