const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('mongoDb connected')
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB;