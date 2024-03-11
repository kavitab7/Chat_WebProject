const Message = require("../models/Message");
const Chat = require("../models/Chat");
const User = require("../models/User");
const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "username email photo").populate("chat");
        return res.status(200).send({
            success: true,
            messages
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const sendMessage = async (req, res) => {
    try {
        const { content, chatId } = req.body;

        if (!content || !chatId) {
            console.log("Invalid data passed into request");
            return res.sendStatus(400);
        }

        let message = await Message.create({
            sender: req.user._id,
            content: content,
            chat: chatId,
        })
        // await message.save();
        message = await message.populate("sender", "username photo")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chat.users",
            select: "username email photo",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message })
        return res.status(200).send({
            success: true,
            message
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }

}

module.exports = { allMessages, sendMessage }