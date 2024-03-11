const Chat = require("../models/Chat");
const User = require("../models/User");
const createChat = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).send({
                success: false,
                message: 'UserId not sent with request'
            })
        }

        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ]
        }).populate("users", "-password").populate("latestMessage")

        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "username email photo"
        });

        if (isChat.length > 0) {
            res.send(isChat[0]);
        } else {
            let chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            };

            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            res.status(200).send({
                success: true,
                FullChat,
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
        })
    }
}

const fetchChats = async (req, res) => {
    try {
        const results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .exec();

        const populatedResults = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
        });

        return res.status(200).send({
            success: true,
            results: populatedResults
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

const createGroupChat = async (req, res) => {
    try {
        if (!req.body.users || !req.body.name) {
            return res.status(400).send({ message: "Please Fill all the fields" });
        }

        let users = JSON.parse(req.body.users);
        if (users.length < 2) {
            return res
                .status(400)
                .send({ message: "More than 2 users are required to form a group chat" });
        }
        users.push(req.user);

        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate({
                path: 'users',
                select: '-password',
            })
            .populate({
                path: 'groupAdmin',
                select: '-password',
            });
        return res.status(200).send({
            success: true,
            fullGroupChat
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = { createChat, fetchChats, createGroupChat }