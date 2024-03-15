import React from 'react'
import { FcAdvance } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import { useAuth } from '../context/auth';

const Home = () => {
    const navigate = useNavigate()
    const [auth] = useAuth()
    return (
        <>
            <div class="bubble">
                <div className="chat-img"></div>
                <div className="home-text-content">
                    Welcome to ChatNest!<br />
                    ChatNest is your cozy corner of the internet where you can chat with your friends just like you're hanging out together.

                    <button className='home-btn' onClick={() => auth.user ? navigate('/chats') : navigate('/login')} ><FcAdvance /> </button>
                </div>
            </div>
        </>
    )
}

export default Home