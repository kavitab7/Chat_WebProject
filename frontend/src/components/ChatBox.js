import React, { useEffect, useState } from 'react';
import MessageBox from './MessageBox';
import { useAuth } from '../context/auth';
import axios from 'axios';
import SideMenu from './SideMenu';
import { useChat } from '../context/chat';
import io from "socket.io-client";
import Loader from './Loader';
import '../styles/chatbox.css';
import ScrollToBottom from 'react-scroll-to-bottom';

const ENDPOINT = "http://localhost:8080";
let socket, selectedChatCompare;


const ChatBox = ({ isSideMenuOpen }) => {
    const { selectedChat, setSelectedChat, notification, setNotification } = useChat()
    const [socketConnected, setSocketConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [auth] = useAuth();
    const [allMessages, setAllMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedChatId, setSelectedChatId] = useState('');


    console.log(selectedChat)

    const getAllMessages = async (selectedChatId) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/message/${selectedChatId}`);
            if (data?.success) {
                setAllMessages(data?.messages);
                setLoading(false);
                selectedChatCompare = selectedChatId;
            } else {
                console.log('Error in fetching messages:', data.messages);
            }
            socket.emit("join chat", selectedChat._id)
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const handleMessageSend = async (newMessage) => {
        try {
            const { data } = await axios.post('/api/message/', {
                content: newMessage,
                chatId: selectedChatId,
            });

            if (data?.success) {
                console.log(data)
                socket.emit("new message", data?.message)
                setAllMessages([...allMessages, data?.message]);
                console.log("mes", allMessages)
                setMessage('');
            } else {
                console.log('Error in sending message:', data.message);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };



    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", auth?.user);
        console.log(auth?.user)
        socket.on("connected", () => setSocketConnected(true));
        socket.on("disconnect", () => {
            console.log("Disconnected from server");
            setSocketConnected(false);
        });
        return () => {
            // Clean up the socket connection when the component unmounts
            socket.disconnect();
        };
    }, [auth.user]);



    useEffect(() => {
        if (auth.user && selectedChat != null) {
            setSelectedChatId(selectedChat?._id);
            getAllMessages(selectedChat?._id);
        }
    }, [auth.user, selectedChat]);

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {

            console.log("newMessageReceived", newMessageReceived);
            if (selectedChat?._id !== newMessageReceived.chat?._id) {
                if (!notification.some(notification => notification.id === newMessageReceived?.id)) {
                    setNotification(prevNotifications => [...prevNotifications, newMessageReceived]);
                }
            } else {
                setAllMessages(prevMessages => [...prevMessages, newMessageReceived]);
            }
        });
    }, [notification]);

    return (
        <div className="layout">
            {isSideMenuOpen && (
                <>
                    <div className="side-menu">
                        <SideMenu />
                    </div>
                </>)}
            <ScrollToBottom className="chat-box-container">
                {selectedChat == null && (
                    <div className="chat-box">
                        <div className="message">Select User To Chat</div>
                    </div>
                )}

                {selectedChat != null && (
                    <div className="chat-box">
                        <div className="messages">
                            {loading ? (
                                allMessages.map((message) => (
                                    <div key={message._id} className={`message ${message.sender._id === auth?.user._id ? 'sent' : 'received'}`}>
                                        <Loader />
                                    </div>
                                ))
                            ) : (
                                allMessages.map((message) => (
                                    <div key={message._id} className={`message ${message.sender._id === auth?.user._id ? 'sent' : 'received'}`}>
                                        <img src={`/api/user/profile-photo/${message.sender._id}`} className="avatar" alt={message.sender.username} />
                                        <div className="message-content">
                                            <div className="sender-name">
                                                ~{message.sender._id === auth?.user._id ? "You" : message.sender.username}
                                            </div>
                                            <div className="message-text">{message.content}</div>
                                            <div className="message-time">{new Date(message.createdAt).toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="message-box-container">
                            <MessageBox onSendMessage={handleMessageSend} />
                        </div>
                    </div>
                )}
            </ScrollToBottom>
        </div>
    );
    ;


};

export default ChatBox;
