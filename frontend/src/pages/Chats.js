import React from 'react'
import SideMenu from '../components/SideMenu'
import ChatBox from '../components/ChatBox'
import '../styles/sidemenu.css'
import '../styles/chats.css'
const Chats = () => {
    return (
        <div className="layout">
            <div className="chat-box">
                <ChatBox />
            </div>
        </div>
    )
}

export default Chats