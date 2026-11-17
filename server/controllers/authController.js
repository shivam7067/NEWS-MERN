const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }

        const payload = {
            id: user._id,
            fullname: user.fullname,
            role: user.role,
            username: user.username
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// Logout
const logout = async (req, res, next) => {
    try {
        res.clearCookie('token');
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

// Get current logged-in user
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({
            success: true,
            user: {
                id: user._id,
                fullname: user.fullname,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    logout,
    getMe
};
