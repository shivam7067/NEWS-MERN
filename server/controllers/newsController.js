const News = require('../models/news');
const Category = require('../models/category');
const Comment = require('../models/comment');
const paginate = require('../utils/pagination');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Get all news (with search, category, author, pagination)
const getNews = async (req, res, next) => {
    try {
        const query = {};

        // Filter by category (either ID or slug)
        if (req.query.category) {
            if (mongoose.Types.ObjectId.isValid(req.query.category)) {
                query.category = req.query.category;
            } else {
                const cat = await Category.findOne({ slug: req.query.category });
                if (cat) {
                    query.category = cat._id;
                } else {
                    return res.json({
                        success: true,
                        data: {
                            docs: [],
                            totalDocs: 0,
                            limit: parseInt(req.query.limit) || 5,
                            totalPages: 0,
                            page: 1,
                            hasPrevPage: false,
                            hasNextPage: false
                        }
                    });
                }
            }
        }

        // Filter by author
        if (req.query.author) {
            if (mongoose.Types.ObjectId.isValid(req.query.author)) {
                query.author = req.query.author;
            }
        }

        // Filter for admin/author management if "mine=true"
        if (req.query.mine === 'true' && req.user) {
            if (req.user.role === 'author') {
                query.author = req.user.id;
            }
        }

        // Search in title and content
        if (req.query.search) {
            query.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { content: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const paginatedResult = await paginate(
            News,
            query,
            req.query,
            {
                populate: [
                    { path: 'category', select: 'name slug' },
                    { path: 'author', select: 'fullname username' }
                ],
                sort: { createdAt: -1 }
            }
        );

        res.json({
            success: true,
            data: paginatedResult
        });
    } catch (error) {
        next(error);
    }
};

// Get single article by ID
const getNewsById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ success: false, message: 'Invalid article ID' });
        }

        const article = await News.findById(id)
            .populate('category', 'name slug')
            .populate('author', 'fullname username');

        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        // Fetch approved comments
        const comments = await Comment.find({ article: id, status: 'approved' })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            article,
            comments
        });
    } catch (error) {
        next(error);
    }
};

// Create news article
const createNews = async (req, res, next) => {
    try {
        const { title, content, category } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Article image is required' });
        }

        const newArticle = new News({
            title,
            content,
            category,
            image: req.file.filename,
            author: req.user.id
        });

        await newArticle.save();
        const populated = await News.findById(newArticle._id)
            .populate('category', 'name slug')
            .populate('author', 'fullname username');

        res.status(201).json({
            success: true,
            message: 'Article created successfully',
            article: populated
        });
    } catch (error) {
        next(error);
    }
};

// Update news article
const updateNews = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content, category } = req.body;

        const article = await News.findById(id);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        if (req.user.role === 'author' && article.author.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'You are not authorized to edit this article' });
        }

        article.title = title || article.title;
        article.content = content || article.content;
        article.category = category || article.category;

        if (req.file) {
            if (article.image) {
                const oldImagePath = path.join(__dirname, '../uploads', article.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            article.image = req.file.filename;
        }

        await article.save();
        const updated = await News.findById(article._id)
            .populate('category', 'name slug')
            .populate('author', 'fullname username');

        res.json({
            success: true,
            message: 'Article updated successfully',
            article: updated
        });
    } catch (error) {
        next(error);
    }
};

// Delete news article
const deleteNews = async (req, res, next) => {
    try {
        const { id } = req.params;
        const article = await News.findById(id);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        if (req.user.role === 'author' && article.author.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this article' });
        }

        if (article.image) {
            const imagePath = path.join(__dirname, '../uploads', article.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await News.findByIdAndDelete(id);
        await Comment.deleteMany({ article: id });

        res.json({
            success: true,
            message: 'Article deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews
};
