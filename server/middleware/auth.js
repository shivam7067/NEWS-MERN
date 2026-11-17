const jwt = require('jsonwebtoken');

const isLoggedIn = async (req, res, next) => {
    try {
        let token = req.cookies?.token;
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
        }

        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: tokenData.id,
            fullname: tokenData.fullname,
            role: tokenData.role,
            username: tokenData.username
        };
        req.id = tokenData.id;
        req.role = tokenData.role;
        req.fullname = tokenData.fullname;

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};

module.exports = isLoggedIn;
