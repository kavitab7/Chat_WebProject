const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors');
const connectDB = require('./connectDB');
const userRoutes = require('../backend/routes/userRoutes')
const chatRoutes = require('../backend/routes/chatRoutes')
const messageRoutes = require('../backend/routes/messageRoutes')
const morgan = require('morgan')
const app = express();

dotenv.config();
connectDB()

app.use(express.json());
app.use(cors());
app.use(morgan('dev'))
app.use('/api/user', userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000',
    }
})

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on("new message", (newMessageReceived) => {
        let chat = newMessageReceived.chat;
        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {

            if (user._id == newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
        // Leave all rooms when disconnected
        socket.rooms.forEach(room => {
            socket.leave(room);
        });
    });
});