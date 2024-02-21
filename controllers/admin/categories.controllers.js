const Category= require('../../models/categories.model');
const { addNewAddressForUser } = require('../user/user.controller');

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

const addCategoryByAdmin = async(req,res)=>{
   try {
    
    req.body.user = req.user._id;

    let categoryAdded = new Category(req.body);

    let result = await categoryAdded.save();

    return res.status(200).json({
        status:false,
        info:"Category Added",
        data:result
    })

   } catch (error) {
     return res.status(500).json({
        status:true,
        info:"Could not create a new category"
     })
   }
}



const updateCategoryByAdmin = async (req, res) =>
{
    try
    {

        let result = await Category.findByIdAndUpdate({_id:req.params.categoryId},req.body,{new:true})

        if(!result){
            return res.status(400).json({
                status:true,
                info:"Could not update category for some unknown reason"
            })
        }

        return res.status(200).json({
            status: false,
            info: "Category Updated",
            data: result
        })

    } catch (error)
    {
        return res.status(500).json({
            status: true,
            info: "Could not create a new category"
        })
    }
}



const deleteCategoryByAdmin = async (req, res) =>
{
    try
    {

        let result = await Category.findByIdAndDelete({ _id: req.params.categoryId }, req.body, { new: true })

        if (!result)
        {
            return res.status(400).json({
                status: true,
                info: "Could not update category for some unknown reason"
            })
        }

        return res.status(200).json({
            status: false,
            info: "Category Deleted",
            data: result
        })

    } catch (error)
    {
        return res.status(500).json({
            status: true,
            info: "Could not create a new category"
        })
    }
}


const getAllPrimaryCategories = async (req, res) =>
{
    try
    {
        let categories = await Category.find({category_type:"primary"});
        if (!categories.length > 0)
        {
            return res.status(400).json({
                error: true,
                message: 'No Categories Found'
            })
        }

        return res.json({
            error: false,
            message: 'Categories retrieved successfully',
            data: categories
        })
    } catch (error)
    {
        return res.status(500).json({
            error: true,
            message: 'Could not retrieve categories'
        })
    }
}


const getAllSubCategories = async (req, res) =>
{
    try
    {
        let categories = await Category.find({category_type:"secondary"});
        if (!categories.length > 0)
        {
            return res.status(400).json({
                error: true,
                message: 'No Categories Found'
            })
        }

        return res.json({
            error: false,
            message: 'Categories retrieved successfully',
            data: categories
        })
    } catch (error)
    {
        return res.status(500).json({
            error: true,
            message: 'Could not retrieve categories'
        })
    }
}


const getAllParentToSubCategories = async (req, res) =>
{
    try
    {
        let categories = await Category.find({parent_category:req.params.parentId});
        if (!categories.length > 0)
        {
            return res.status(400).json({
                error: true,
                message: 'No Categories Found'
            })
        }

        return res.json({
            error: false,
            message: 'Categories retrieved successfully',
            data: categories
        })
    } catch (error)
    {
        return res.status(500).json({
            error: true,
            message: 'Could not retrieve categories'
        })
    }
}





module.exports = {
    getAllCategories,
    getAllPrimaryCategories,
    getAllSubCategories,
    getAllParentToSubCategories,
    addNewAddressForUser,
    updateCategoryByAdmin,
    deleteCategoryByAdmin

}