const User = require("../models/User");
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const fs = require('fs')
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.fields;
        const { photo } = req.files;
        console.log(username)
        switch (true) {
            case !username:
                return res.status(400).send({ success: false, error: 'username is required' });
            case !email:
                return res.status(400).send({ success: false, error: 'email is required' })
            case !password:
                return res.status(400).send({ success: false, error: 'password is required' })
            case !photo:
                return res.status(400).send({ success: false, error: 'photo is required and size should be less than 1 mb' })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).send({
                success: true,
                error: 'Email already exist'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        if (photo) {
            user.photo.data = fs.readFileSync(photo.path);
            user.photo.contentType = photo.type
        }
        await user.save();
        return res.status(201).send({
            success: true,
            message: 'User registerd successfully',
            user
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'error in registration',
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).send({
                success: false,
                message: 'please provide email or password'
            })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).send({
                success: false,
                message: 'email not exist'
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: 'invalid username or password'
            })
        }
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })

        return res.status(200).send({
            success: true,
            message: 'login successfully',
            user,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'error in login',
        })
    }
}

const allUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
        return res.status(200).send({
            success: true,
            message: 'Got all users',
            users
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'error in getting all users',
        })
    }
}

const UsersProfilePhoto = async (req, res) => {
    try {
        const user = await User.findById(req.params.uid).select("photo");

        if (user && user.photo && user.photo.data) {
            res.set("Content-type", user.photo.contentType);
            return res.status(200).send(user.photo.data);
        } else {
            return res.status(404).send({
                success: false,
                message: 'Profile photo not found'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: ' error while getting profile photo',
        });
    }
}
module.exports = { registerUser, loginUser, allUsers, UsersProfilePhoto }