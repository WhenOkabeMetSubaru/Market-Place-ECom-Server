const Product = require('../../models/product.model');
const User = require('../../models/user.model')
const Shop = require('../../models/shop.model');
const { default: mongoose } = require('mongoose');

const addNewProduct = async (req,res) => {
    if (!req.user._id && !req.user.role == 'seller') {
        return res.status(400).json({
            status: true,
            info: "Seller Login Required"
        })
    }
    try {
        req.body.owner  = req.user._id;
        req.body.shop = req.params.shopId

        let isExists = await Product.find({ name: req.body.name });
        if (isExists.length > 0) {
            return res.status(400).json({
                status: true,
                info: 'Item with same name already exists'
            })
        }
        let product = new Product(req.body);
        let result = await product.save();
        return res.status(200).json({
            status: false,
            info: 'Product Successfuly created',
            data: result

        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: true,
            info: "Could not create a product"
        })
    }
}

const getAllProductsByShop = async (req,res) => {
    if (!req.user._id && !req.user.role == 'seller') {
        return {
            status: true,
            info: 'Seller login required'
        }
    }
    try {
       
        if(req.params.shopId ==null){
            return {
                status:true,
                info:"No shopId"
            }
        }
        let shopData = await Shop.findOne({ _id: req?.params?.shopId }).populate('owner', '_id name');

        
        if (shopData.owner._id.toString() !== req.user._id?.toString()) {
            return res.status(401).json({
                status: true,
                info: 'User not authorized'
            })
        }
        let allproducts = await Product.find({ shop: req?.params?.shopId }).populate('owner', '_id name').populate('shop', '_id name');

        if (allproducts.length > 0) {
            return res.status(200).json({
                status: false,
                info: 'Products retrieving successful',
                data: allproducts
            })
        }
        return res.json({
            status: true,
            info: 'No Products found'
        })

    } catch (error) {
        return res.status(500).json({
            status: true,
            info: error
        })
    }
}

const updateProductByID = async (req,res) => {
    if (!req.user._id && !req.user.role == 'seller') {
        return res.status(400).json({
            status: true,
            info: 'Login is required'
        })
    }
    try {

        args.productInput.updated = Date.now();
        let product = await Product.findByIdAndUpdate({ _id: args.productInput._id }, args.productInput, { new: true }).populate('owner', '_id name').populate('shop', '_id name')
        let result = product.save();
        if (!product) {
            return res.status(404).json({
                status: true,
                info: 'No Product found'
            })
        }

        return res.status(200).json({
            status: false,
            info: 'Product Updated Successfully',
            data: result
        })

    } catch (error) {
        return res.status(500).json({
            status: true,
            info: "Cannot update the product"
        })
    }
}

const deleteProductByID = async (req,res) => {
    if (!req.user._id && !req.user.role == 'seller') {
        return res.status(400).json({
            status: true,
            info: 'Seller Login required'
        })
    }
    try {

        let result = await Product.findByIdAndDelete(req.params.productId);
        if (!result) {
            return res.status(404).json({
                status: true,
                info: 'No product to delete'
            })
        }

        return res.status(200).json({
            status: false,
            info: 'Product Deleted Successfully',
            data: result
        })

    } catch (error) {
        return res.status(500).json({
            status: true,
            info: 'Cannot delete the product'
        } )
    }
}

const getCategories = async (req,res) => {
    if (!req.user._id && !req.user.role) {
        return res.status(400).json({
            status: true,
            info: 'Login is required'
        })
    }
    try {
        let categories = await Product.distinct('category', {});

        return res.status(200).json({
            status: false,
            info: 'Categories successfully retrieved',
            data: categories
        })
    } catch (error) {

        return res.status(500).json({
            status: true,
            info: 'Could not list categories'
        })
    }
}

const updateProductStatus = async (req,res) => {
    if (!req.user._id && !req.user.role == 'seller') {
        return res.status(401).json({
            status: true,
            info: 'Seller Login required'
        })
    }
    try {

        let result = await Product.findByIdAndUpdate({ _id: req.body._id }, { active: req.body.active }, { new: true });
        if (!result) {
            return res.status(400).json({
                status: true,
                info: 'Unable to update the product'
            })
        }
        return res.json({
            status: false,
            info: 'Product Updated Successfully',
            data: result
        })
    } catch (error) {

        return res.status(500).json({
            status: true,
            info: 'Could not update products'
        })
    }
}

const getAllProducts = async (req,res) => {
   
    try {

        let products = await Product.find().populate('owner', '_id name').populate('shop', '_id name').sort('-created');
        if (!products.length > 0) {
            return res.status(404).json({
                status: true,
                info: 'No products found'
            })
        }

        return res.status(200).json({
            status: false,
            info: 'Products retrieved successfully',
            data: products
        })

    } catch (error) {
        return res.status(500).json({
            status: true,
            info: 'Could not retrieve Products'
        })
    }
}

const getProductByIDUserSide = async (req,res) => {
  
    try {

      
        let productDetails = await Product.findById(req.params.productId).populate('shop');
        if (!productDetails) {
            return res.status(404).json({
                status: true,
                info: 'No product found'
            })
        }
        return res.status(200).json({
            status: false,
            info: 'Product retrieved successfully',
            data: productDetails
        })


    } catch (error) {
        return res.status(500).json({
            status: true,
            info: 'Could not retrieve the product'
        })
    }
}

const getProductsByPrice = async (req,res) => {

    let args = req.body;
    try {
    

        let query = {};
        if (args.low || args.high) {
            query = {
                sellingprice: {
                    $gte: args.low ? args.low : 0,
                    $lte: args.high ? args.high : Number.MAX_VALUE
                }
            }
        }

        let sortquery = {};

        if (args.sort == 'newest') {
            sortquery = {
                'created': -1
            }
        } else {
            sortquery = {
                'created': 1
            }
        }

        let products = await Product.aggregate([
            {
                $match: query,

            },
            {
                $sort:sortquery
            }
        ])


        if (!products) {
            return res.status(404).json({
                status: true,
                info: 'Could not find any products'
            })
        }

        return res.status(200).json({
            status: false,
            info: 'Products found',
            data: products
        })

    } catch (error) {
        return res.status(500).json({
            status: true,
            info: 'Could not find any products'
        })
    }
}
const addProductReviewAndRating= async (_,args,context)=>{
    if(!req.user._id && req.user.role !=='user'){
        return res.status(400).json({
            status: true,
            info: 'User login required'
        })
    }
    try {
        
        let productReview = {
            title:args.RatingReview.title,
            description:args.RatingReview.description,
            userID:args.RatingReview.userID,
            rating:args.RatingReview.userRating

        }


        
        let product= await Product.findByIdAndUpdate(args.RatingReview._id, {$inc: {[`ratings.${args.RatingReview.rating}`]: 1},$push:{review:productReview}}, {new: true})
       
        console.log(product);
      
        // let finalProductResult = await Product.findByIdAndUpdate({_id:args._id},{$inc:{'ratings.rating_count':1},$set:{'ratings.rating':Ratings} },{ new:true})
        return res.status(200).json({
            status: false,
            info: 'Successfully added a review',
            data: product
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: true,
            info: 'Could not add a review and rating'
        })
    }
}

const searchProductHomeScreen  = async(req,res)=>{
   
    try {
     
        const regexItem = new RegExp(req.params.name)
        let productDetails = await Product.find({name:{$regex:regexItem}}).limit(10)

        if(!productDetails?.length>0){
            return res.status(404).json({
                status:true,
                info:"No Products Found"
            })
        }


        return res.json({
            status:false,
            info:"Product Found",
            data:productDetails
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status:true,
            info:"Some Unknown error has occurred"
        })
    }
}

module.exports = {
    getProductByIDUserSide,
    addNewProduct
    , getAllProductsByShop,
    updateProductByID,
    deleteProductByID,
    getCategories,
    updateProductStatus,
    getAllProducts,
    getProductsByPrice,
    addProductReviewAndRating,
    searchProductHomeScreen
};