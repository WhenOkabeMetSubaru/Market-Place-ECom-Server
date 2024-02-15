const Order= require('../../models/order.model');


const getAllOrders = async(req,res)=>{
    try {
        let orders = await Order.find({});
        if(!orders.length>0){
            return res.status(400).json({
                error:true,
                message:'No orders found'
            })
        }

        return res.json({
            error:false,
            message:'Orders retrieved successfully',
            data:orders
        })
    } catch (error) {
        return res.status(500).json({
            error:true,
            message:'Could not fetch order details'
        })
    }
}

const getAllOrderDetailsByShop = async(req,res)=>{
    try {
        // console.log(req.shop)
         let shopID = req.params.shopId;
        let orders = await Order.find({'products.shop':shopID})
                        .populate({path:'products.product',select:'_id name mrp'})
                        .sort('-created')
                        .exec()


        
        if(!orders.length>0){
            return res.status(400).json({
                error:true,
                message:'No orders found'
            })
        }

        return res.json({
            error:false,
            message:'Orders Retrieved',
            data:orders
        })
        
    } catch (error) {
        return res.status(500).json({
            error:true,
            message:'Could not retrieve orders'
        })
    }
}

const getAllOrderDetailsByUser = async(req,res)=>{
    try {

       
        let userID = req.user._id;
        let orders = await Order.find({ordered_by:userID});

        if(!orders.length>0){
            return res.status(400).json({
                error:true,
                message:'No orders found'
            })
        }

        return res.json({
            error:false,
            message:'Successfully retrieved orders',
            data:orders
        })

    } catch (error) {
        return res.status(500).json({
            error:true,
            message:'Could not retrieve order details'
        })
    }
}



module.exports = {
    getAllOrders,
    getAllOrderDetailsByShop,
    getAllOrderDetailsByUser
}