const Comment = require('../models/comment');
const News = require('../models/news');

// Get comments (admin: all, author: for their articles)
const getAllComments = async (req, res, next) => {
    try {
        let query = {};
        if (req.user.role === 'admin') {
            if (req.query.status) {
                query.status = req.query.status;
            }
        } else {
            // Author only sees comments on their own articles
            const userNews = await News.find({ author: req.user.id }).select('_id');
            const newsIds = userNews.map((news) => news._id);
            query.article = { $in: newsIds };
            if (req.query.status) {
                query.status = req.query.status;
            }
        }

        const comments = await Comment.find(query)
            .populate('article', 'title')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            comments
        });
    } catch (error) {
        next(error);
    }
};

// Add comment (public endpoint)
const addComment = async (req, res, next) => {
    try {
        const { articleId } = req.params;
        const { name, email, content } = req.body;

        const article = await News.findById(articleId);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        const comment = new Comment({
            article: articleId,
            name,
            email,
            content,
            status: 'approved' // Approved by default for instant visibility; status can be moderated by author/admin
        });


        await comment.save();

        res.status(201).json({
            success: true,
            message: 'Comment posted successfully',
            comment
        });
    } catch (error) {
        next(error);
    }
};

// Update comment status
const updateCommentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const comment = await Comment.findById(id).populate('article');
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        // Author permission check: author can only update comments on their own article
        if (req.user.role === 'author' && comment.article && comment.article.author.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized to moderate this comment' });
        }

        comment.status = status;
        await comment.save();

        res.json({
            success: true,
            message: 'Comment status updated successfully',
            comment
        });
    } catch (error) {
        next(error);
    }
};

// Delete comment
const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id).populate('article');
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        if (req.user.role === 'author' && comment.article && comment.article.author.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this comment' });
        }

        await Comment.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllComments,
    addComment,
    updateCommentStatus,
    deleteComment
};
