const Category = require('../models/category');
const News = require('../models/news');

// Get all categories with article count
const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ timestamp: -1 });

        // Get article count for each category
        const categoriesWithCounts = await Promise.all(
            categories.map(async (cat) => {
                const articleCount = await News.countDocuments({ category: cat._id });
                return {
                    ...cat.toObject(),
                    articleCount
                };
            })
        );

        res.json({
            success: true,
            categories: categoriesWithCounts
        });
    } catch (error) {
        next(error);
    }
};

// Get single category by ID or slug
const getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        let category;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            category = await Category.findById(id);
        } else {
            category = await Category.findOne({ slug: id });
        }

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        const articleCount = await News.countDocuments({ category: category._id });

        res.json({
            success: true,
            category: {
                ...category.toObject(),
                articleCount
            }
        });
    } catch (error) {
        next(error);
    }
};

// Create category
const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Category already exists' });
        }

        const category = await Category.create({ name, description });
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        next(error);
    }
};

// Update category
const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        if (name && name !== category.name) {
            const existing = await Category.findOne({
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: id }
            });
            if (existing) {
                return res.status(400).json({ success: false, message: 'Category with this name already exists' });
            }
            category.name = name;
        }

        if (description !== undefined) {
            category.description = description;
        }

        await category.save();

        res.json({
            success: true,
            message: 'Category updated successfully',
            category
        });
    } catch (error) {
        next(error);
    }
};

// Delete category
const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        const associatedArticles = await News.findOne({ category: id });
        if (associatedArticles) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete category with associated articles. Reassign or delete articles first.'
            });
        }

        await Category.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
