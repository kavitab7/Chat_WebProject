import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/auth';
import GroupModel from './GroupModel';
import { FaPlusCircle } from 'react-icons/fa';
import img from '../assets/gpAvatar.jpg';
import { useChat } from '../context/chat';
import Loader from './Loader';
import '../styles/sidemenu.css'

const SideMenu = () => {
    const [auth] = useAuth()
    const [allusers, setAllUsers] = useState([])
    const [allchats, setAllChats] = useState([])
    const { selectedChat, setSelectedChat } = useChat()
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (auth.user) {

            getAllChats();
            getAllUsers();

        }
    }, [auth.user])

    const createChat = async (userId) => {
        try {
            const { data } = await axios.post('/api/chat/', { userId });
            if (data.success) {
                setAllChats([...allchats, data?.FullChat]);
                setAllUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
            } else {
                console.log(data.message)
            }

        } catch (error) {
            console.log(error)
        }
    }

    const getAllUsers = async () => {
        try {

            const { data } = await axios.get('/api/user/all-users');
            if (data.success) {
                const chatUsers = allchats.filter(chat => !chat.isGroupChat).flatMap(chat => chat.users); // Flatten the array

                const filteredUsers = data?.users.filter(user => {
                    return !chatUsers.some(chatUser => chatUser._id === user._id);
                })
                setAllUsers(filteredUsers)

            } else {
                console.log(data.message)
            }

        } catch (error) {
            console.log(error)
        }
    }
    const getAllChats = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/chat/');
            if (data.success) {
                setAllChats(data?.results)
                setLoading(false);
            } else {
                console.log(data.message)
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleSelected = (chat) => {
        setSelectedChat(chat);
    }

    return (
        <>


            <div className="menu-items">
                {allchats.map((c) => (
                    <div
                        key={c._id}
                        className={`menu-item ${selectedChat && selectedChat._id === c._id ? 'active' : ''}`}
                        onClick={() => handleSelected(c)}
                    >
                        {loading ? (
                            <Loader />
                        ) : (
                            <>
                                {!c.isGroupChat && c.users.length >= 2 ? (
                                    c.users[1]._id === auth.user._id ? (
                                        <>
                                            <img src={`/api/user/profile-photo/${c.users[0]._id}`} className="avatar" alt={c.username} />
                                            <span className="user-name">{c.users[0]?.username}</span>
                                        </>
                                    ) : (
                                        <>
                                            <img src={`/api/user/profile-photo/${c.users[1]._id}`} className="avatar" alt={c.username} />
                                            <span className="user-name">{c.users[1]?.username}</span>
                                        </>
                                    )
                                ) : (
                                    <>
                                        <img src={img} className="avatar" alt="Group Avatar" />
                                        <span className="user-name">{c.chatName}</span>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
            <h3>other users</h3>
            {allusers.map((u) => (
                <div key={u._id} className="menu-item">
                    <img src={`/api/user/profile-photo/${u._id}`} className="avatar" alt={u.username} />
                    <span className="user-name">{u.username}</span>
                    <button className="add-to-chat-button" onClick={() => createChat(u._id)}>
                        <FaPlusCircle />
                    </button>
                </div>
            ))}
            <button className="create-group-button"><GroupModel /></button>

        </>
    );
}

export default SideMenu;
