import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth';
import { NavLink } from 'react-router-dom';
import { useChat } from '../context/chat';
import { Snackbar, Badge } from '@mui/material';
import { FaTimes } from 'react-icons/fa';
import { AiOutlineBell } from 'react-icons/ai';
import '../styles/navbar.css';

const Navbar = ({ isSideMenuOpen, setIsSideMenuOpen }) => {
    const { notification, setNotification } = useChat();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [auth, setAuth] = useAuth();

    const toggleSideMenu = () => {
        setIsSideMenuOpen(!isSideMenuOpen);
    };

    const handleLogout = () => {
        setAuth({
            ...auth,
            user: null,
            token: '',
        });
        localStorage.removeItem('auth');
    };

    const showNotification = (message) => {
        setSnackbarMessage(`New message from ${message}`);
        setSnackbarOpen(true);
    };

    const closeNotification = () => {
        setSnackbarOpen(false);
        setNotification(prevNotifications => prevNotifications.slice(1));
    };

    const handleBadgeClick = () => {
        const allMessages = notification.map(notificationItem => notificationItem.sender.username || notificationItem.chat.chatName).join(", ")
        setSnackbarMessage(`You have new notifications: ${allMessages}`);
        setSnackbarOpen(true);
    };

    useEffect(() => {
        if (notification && notification.length > 0) {
            notification.forEach((notificationItem) => {
                showNotification(notificationItem.sender.username);
            });
        }
    }, [notification]);

    return (
        <div>
            <nav className="main-navbar">
                <div className="left-nav">
                    <div className={isSideMenuOpen ? 'menu-close-img' : 'menu-open-img'} onClick={toggleSideMenu}>
                    </div>
                    <NavLink to="/" className="navbar-brand left-nav">ChatNest</NavLink>
                </div>
                <div className="right-nav">
                    {auth.user ? (
                        <>
                            <Snackbar
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={snackbarOpen}
                                autoHideDuration={20000}
                                onClose={closeNotification}
                                message={snackbarMessage}
                                action={<FaTimes onClick={closeNotification} style={{ cursor: 'pointer' }} />}
                            />
                            <Badge badgeContent={notification.length} color="error" onClick={handleBadgeClick} style={{ cursor: 'pointer' }}>
                                <AiOutlineBell style={{ color: "white", marginLeft: 5 }} />
                            </Badge>

                            <NavLink to="/chats" className="nav-link">
                                Chats
                            </NavLink>
                            <NavLink to="/login" onClick={handleLogout} className="btn">Logout</NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className="btn">Login</NavLink>
                            <NavLink to="/register" className="register btn">Register</NavLink>
                        </>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
