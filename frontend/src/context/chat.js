const { createContext, useState, useContext } = require("react");

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [notification, setNotification] = useState([]);
    const [chats, setChats] = useState([]);
    const [user, setUser] = useState()

    return (
        <ChatContext.Provider value={{
            selectedChat, setSelectedChat,
            notification, setNotification,
            chats, setChats,
            user, setUser
        }}>
            {children}
        </ChatContext.Provider>
    )
}

const useChat = () => useContext(ChatContext)

export { useChat, ChatProvider }