const Shop = require('../../models/shop.model');
const User = require('../../models/user.model')

const addNewShop = async(req,res)=>{
    if(!req.user._id && req.user.role !=='seller'){
        return {
            status:true,
            info:'Seller login required'
        }
    }
    try {
        req.body.owner = req.user._id;
        const shop = new Shop(req.body);
        await shop.save();

        return res.status(200).json({
            status: false,
            info: 'Shop created Successfully',
            data: shop
        })
        
    } catch (error) {
        return res.status(500).json({
            status: true,
            info: 'Could not create a shop'
        })
    }
}

const getAllShops = async (req,res)=>{
    try {
        let shops = await Shop.find()
                                .populate('owner','_id name')
        return res.json({
            status: false,
            info: 'Shops Retrieved Successfully',
            data: shops
        })
        
    } catch (error) {
        return res.status(500).json({
            status: true,
            info: 'Could not retrieve shops'
        })
    }
}

const getShopsByOwner = async (req,res)=>{
    if(!req.user._id){
        return res.status(400).json({
            status: true,
            info: 'Login required'
        })
    }
    try {

      
        
        if(!req.user.role=='seller'){
            return res.status(401).json({
                status: true,
                info: 'User not authorized'
            })
        }
       
        let shops = await Shop.find({owner:req.user._id})
                                .populate('owner','_id name');
        if(shops.length<1){
            return res.status(404).json({
                status: true,
                info: 'No Shops found'
            })
        }

        return res.json({
            status: false,
            info: 'Shops found',
            data: shops
        })
        
    } catch (error) {
        
        return res.status(500).json({
            status: true,
            info: 'Cannot retrive shops'
        })
    }
}

const getShopByID = async(req,res)=>{
    if(!req.user._id){
        return {
            status:true,
            info:'Login required'
        }
    }
    try {
        if(req.user.role !== 'seller'){
            return res.status(401).json({
                status: true,
                info: 'User not authorized'
            })
        }
        

        let shopData = await Shop.findById(req.params.shopId).populate('owner','_id name').exec()
        if(!shopData){
            return res.status(404).json({
                status: true,
                info: 'Not shop found'
            })
        }

        return res.json({
            status: false,
            info: 'Shop Data Success',
            data: shopData
        })
        
    } catch (error) {
        return res.status(500).json({
            status: true,
            info: 'Could not retrieve Shop'
        })
    }
}

const UpdateShopByID = async(req,res)=>{
    if(!req.user._id &&  !req.user.role=='seller'){
        return res.status(400).json({
            status: true,
            info: "Login required"
        })
    }
    try {
        req.body.updated = Date.now();
        let shop = await Shop.findByIdAndUpdate({_id:req.params.shopId},req.body,{new:true})
        let result = shop.save();
        return res.json({
            status: false,
            info: 'Succesfully updated',
            data: result
        })
        

    } catch (error) {
        return res.status(500).json({
            status: true,
            info: 'Cannot Update the Shop'
        })
    }
}
const deleteShopByID = async(req,res)=>{
    if(!req.user._id && !req.user.role=='seller'){
        return res.status(400).json({
            status: true,
            info: 'Seller Login required'
        })
    }
    try {
        
        let deletedShop = await Shop.findByIdAndDelete(req.params.shopId);
        if(!deletedShop){
            return res.status(400).json({
                status: true,
                info: 'Could not delete shop'
            })
        }
        return res.json({
            status: false,
            info: 'Shop deleted Successfully',
            data: deletedShop
        })

    } catch (error) {
        return res.status(500).json({
            status: true,
            info: 'Could not delete the shop'
        })
    }
}

module.exports = {addNewShop,getAllShops,getShopsByOwner,getShopByID,UpdateShopByID,deleteShopByID};