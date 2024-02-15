const Product = require('../../models/product.model');

const getAllProductsByAdmin = async(req,res)=>{
    try {
        
        let products = await Product.find({});
        if(!products.length>0){
            return res.status(400).json({
                error:true,
                message:'No products found'
            })
        }

        return res.json({
            error:false,
            message:'Products retrieved successfully',
            data:products
        })

    } catch (error) {
        return res.status(400).json({
            error:true,
            message:'Could not retrieve products'
        })
    }
}

const getProductByID = async(req,res,next,id)=>{
    try {
       
        let productDetails = await Product.findById(req.params.productId);
        if(!productDetails){
            return res.status(400).json({
                error:true,
                message:'No product found'
            })
        }
        return res.json({
            error:false,
            message:'Product details retrieved',
            data:productDetails
        })
    } catch (error) {
        // console.log(error)
        return res.status(400).json({
            error:true,
            message:'Could not retrieve products'
        })
    }
}

const getProductsByShopAdmin = async(req,res,next)=>{
    try {
        let shopProducts = await Product.find({shop:req.params.shopId});
      
        if(!shopProducts.length>0){
            return res.status(400).json({
                error:true,
                message:'No Products found for this shop'
            })
        }

        return res.json({
            error:false,
            message:'Products found',
            data:shopProducts

        })
    } catch (error) {
        return res.status(400).json({
            error:true,
            message:'Could not find products'
        })
    }
}
const getProductsByUserAdmin = async(req,res,next)=>{
    try {
       
        let userProducts = await Product.find({owner:req.user._id});
        if(!userProducts.length>0){
            return res.status(400).json({
                error:true,
                message:'No products found'
            })
        }

        return res.json({
            error:false,
            message:'Products found',
            data:userProducts
        })
    } catch (error) {
        return res.status(400).json({
            error:true,
            message:'Could not find products'
        })
    }
}

module.exports = {
    getAllProductsByAdmin,
    getProductByID,
    getProductsByShopAdmin,
    getProductsByUserAdmin
}