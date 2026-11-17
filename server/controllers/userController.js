const User = require('../models/user');
const News = require('../models/news');
const bcrypt = require('bcryptjs');

// Get all users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({
            success: true,
            users
        });
    } catch (error) {
        next(error);
    }
};

// Get single user by ID
const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

// Create new user
const createUser = async (req, res, next) => {
    try {
        const { fullname, username, password, role } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username is already taken' });
        }

        const newUser = new User({
            fullname,
            username,
            password,
            role: role || 'author'
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                role: newUser.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update user
const updateUser = async (req, res, next) => {
    try {
        const { fullname, password, role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (fullname) user.fullname = fullname;
        if (role) user.role = role;
        if (password && password.trim() !== '') {
            user.password = password;
        }

        await user.save();

        res.json({
            success: true,
            message: 'User updated successfully',
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

// Delete user
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Prevent admin from deleting themselves
        if (req.user.id === id) {
            return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const hasArticles = await News.findOne({ author: id });
        if (hasArticles) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete user with associated articles. Delete their articles first.'
            });
        }

        await User.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
