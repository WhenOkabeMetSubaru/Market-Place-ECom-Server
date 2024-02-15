const Category = require('../../models/categories.model');

const addNewCategory = async (req,res) => {
    if (!req.user._id && req.user.role !== 'seller' && req.user.role !== 'admin') {
        return res.status(400).json({
            status: true,
            info: 'Admin Login is required'
        })
    }
    try {
        let category = new Category(req.body);
        let result = category.save();
        return res.status(200).json({
            status: false,
            info: 'Category Created Successfully',
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            status: true,
            info: 'Could not create a category'
        })
    }
}

const getAllCategories = async (req,res) => {
    if (!req.user._id && !req.user.role) {
        return res.status(400).json({
            status: true,
            info: 'User login required'
        })
    }
    try {
        let categories = await Category.find({});
        if (!categories) {
            return res.status(400).json({
                status: true,
                info: 'No categories found'
            })
        }

        return res.json({
            status: false,
            info: 'Categories Found',
            data: categories
        })
    } catch (error) {
        return res.status(500).json({
            status: true,
            info: 'Could not retrieve categories'
        })
    }
}

module.exports = {
    addNewCategory,
    getAllCategories
}