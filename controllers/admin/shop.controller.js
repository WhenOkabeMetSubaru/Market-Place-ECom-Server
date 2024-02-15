const Shop= require('../../models/shop.model');


const getShopByIDAdmin = async(req,res,next,id)=>{
    try {
       
        let shopDetails = await Shop.findById(req.params.shopId);
        if(!shopDetails){
            return res.status(400).json({
                error:true,
                message:'No shop found'
            })
        }
        // console.log(shopDetails)
        req.shop = shopDetails;
        console.log(req.shop)
       next();

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            error:true,
            message:'Could not retrieve shops'
        })
    }
}

const getAllShopsByAdmin = async (req,res)=>{
    try {
       
        let shops = await Shop.find({});
        if(!shops.length>0){
            return res.status(400).json({
                error:true,
                message:'No shops found'
            })
        }

        return res.json({
            error:false,
            message:'Shops fetched successfully',
            data:shops
        })

    } catch (error) {
        return res.status(400).json({
            error:true,
            message:'Could not fetch shops'
        })
    }
}

const read = async(req,res)=>{
    return res.json({
        error:false,
        message:'Successful',
        data:req.shop
    })
}

const getAllShopsByOwner = async(req,res)=>{
    try {
        
        let allshops = await Shop.find({owner:req.user._id});
        if(!allshops.length>0){
            return res.status(400).json({
                error:true,
                message:'No Shops found'
            })
        }

        return res.json({
            error:false,
            message:'Shops found',
            data:allshops
        })

    } catch (error) {
        return res.status(400).json({
            error:true,
            message:'Could not find shops'
        })
    }
}



module.exports = {
    getShopByIDAdmin,
    read,
    getAllShopsByAdmin,
    getAllShopsByOwner
}