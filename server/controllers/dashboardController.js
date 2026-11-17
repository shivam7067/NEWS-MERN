const News = require('../models/news');
const Category = require('../models/category');
const User = require('../models/user');
const Comment = require('../models/comment');

const getDashboardStats = async (req, res, next) => {
    try {
        const isAdmin = req.user.role === 'admin';
        
        let articlesCount;
        if (isAdmin) {
            articlesCount = await News.countDocuments();
        } else {
            articlesCount = await News.countDocuments({ author: req.user.id });
        }

        const categoriesCount = await Category.countDocuments();
        const usersCount = isAdmin ? await User.countDocuments() : 0;

        let commentsCount;
        if (isAdmin) {
            commentsCount = await Comment.countDocuments();
        } else {
            const userNews = await News.find({ author: req.user.id }).select('_id');
            const newsIds = userNews.map(n => n._id);
            commentsCount = await Comment.countDocuments({ article: { $in: newsIds } });
        }

        res.json({
            success: true,
            stats: {
                articles: articlesCount,
                categories: categoriesCount,
                users: usersCount,
                comments: commentsCount,
                fullname: req.user.fullname,
                role: req.user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats
};
