const Category= require('../../models/categories.model');

const getAllCategories = async (req,res)=>{
    try {
        let categories = await Category.find({});
        if(!categories.length>0){
            return res.status(400).json({
                error:true,
                message:'No Categories Found'
            })
        }

        return res.json({
            error:false,
            message:'Categories retrieved successfully',
            data:categories
        })
    } catch (error) {
        return res.status(500).json({
            error:true,
            message:'Could not retrieve categories'
        })
    }
}






module.exports = {
    getAllCategories
}