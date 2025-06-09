import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from './Login';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-content">
                    <Link to="/" className="logo">
                        🔍 Lost & Found
                    </Link>
                    
                    <div className="nav-links">
                        <Link to="/" className="nav-link">Home</Link>
                        
                        {user ? (
                            <>
                                <Link to="/post" className="nav-link">Post Item</Link>
                                <Link to="/my-items" className="nav-link">My Items</Link>
                                <div className="user-info">
                                    <span className="user-name">Hi, {user.name}!</span>
                                    <button onClick={handleLogout} className="btn btn-secondary">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button 
                                onClick={() => setShowLogin(true)} 
                                className="btn btn-primary"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {showLogin && (
                <Login 
                    onClose={() => setShowLogin(false)} 
                    onSuccess={() => setShowLogin(false)} 
                />
            )}
        </>
    );
};

export default Navbar;