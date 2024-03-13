import React, { useState } from 'react';
import { RiSendPlane2Line } from 'react-icons/ri';
import '../styles/msgInput.css'
const MessageBox = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() !== '') {
            onSendMessage(message);
            setMessage('');
        }
    };
    return (
        <>
            <form className="message-input" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={message}
                    onChange={handleChange}
                    placeholder="Type your message..."
                    className="input-field"
                />
                <button type="submit" className="send-button">
                    <RiSendPlane2Line />
                </button>
            </form>
        </>
    )
}

export default MessageBox