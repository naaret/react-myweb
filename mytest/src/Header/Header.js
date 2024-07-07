import './styles.css';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Header = () => {
    const history = useHistory(); // Move useHistory inside the functional component
    const [username, setUsername] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('username');
        history.push('/');
    };

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    return (
        <header className="header">
            <h1>Follow</h1> 
            <nav>
                <ul>
                    <li><a href="/home">Home</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                    {username && <li>Welcome {username}</li>}
                    <li><button 
                        onClick={handleLogout} 
                        className="logout-button"
                    >Logout</button></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
