const JWT = require('jsonwebtoken');

const isSignIn = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = JWT.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT error:', error.message);
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

module.exports = isSignIn;
