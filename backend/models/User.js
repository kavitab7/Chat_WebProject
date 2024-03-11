const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter username']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please enter email'],
        validate: [isEmail, 'Invalid Email']
    },
    password: {
        type: String,
        required: [true, 'Please enter password']
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true }
)

module.exports = mongoose.model('User', userSchema);