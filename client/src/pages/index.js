import React from 'react';
import { Link } from 'react-router';

const Home = () => {
    return (
        <div>
            <h1>Welcome to Local Chatbot!</h1>
            <Link to="/login">
                <button>
                    Login Now!
                </button>
            </Link>
        </div>
    );
};

export default Home;
