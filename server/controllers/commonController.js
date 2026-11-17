const Setting = require('../models/setting');
const News = require('../models/news');
const Category = require('../models/category');

const getCommonData = async (req, res, next) => {
    try {
        const setting = await Setting.findOne();

        const latestNews = await News.find()
            .populate('category', 'name slug')
            .populate('author', 'fullname')
            .sort({ createdAt: -1 })
            .limit(5);

        const categoriesInUse = await News.distinct('category');
        const categories = await Category.find({ _id: { $in: categoriesInUse } }).sort({ name: 1 });

        res.json({
            success: true,
            setting: setting || {
                website_title: 'News CMS',
                website_logo: '',
                footer_description: '© Copyright 2025 News | Powered by SHIVAM'
            },
            latestNews,
            categories
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCommonData
};
