const Order  = require('../../models/order.model');
const Product = require('../../models/product.model')

const addNewOrder = async(req,res)=>{
    if(!req.user._id && req.user.role !=='user'){
        return res.status(400).json({
            status: true,
            info: 'User Login is required'
        })
    }
    try {
        
        let data = req.body;
        data.ordered_by = req.user._id;
        
        let bulkUpdate = data?.products?.map((item)=>{
            return {
                "updateOne":{
                    "filter":{
                        "_id":item.product
                    },
                    "update":{
                        "$inc":{
                            "quantity":-item.quantity
                        }
                    }
                }
            }
        })

        let allOrders = data?.products?.map((item)=>{
            return {
                ...data,
                products:{
                    product:item.product,
                    quantity: +item.quantity,
                    shop: item.shop
                },
                
            }
        })
        

        let result = await Product.bulkWrite(bulkUpdate,{});
        
        

        // let order  = new Order(req.body);
        // let resultFinal = await order.save();
      
       
        let resultFinal  = await Order.insertMany(allOrders);

        return res.status(200).json({
            status: false,
            info: 'Order Placed Successfully',
            data: resultFinal
        })



    } catch (error) {
    console.log(error)
        return res.status(500).json({
            status: true,
            info: 'Could not create an order'
        })
    }
}

const getOrderByUserID=async(req,res)=>{
    if(!req.user._id && !req.user.role){
        return res.status(400).json({
            status: true,
            info: 'Login is required'
        })
    }
    try {
        
        let orders = await Order.find({ordered_by:req.user._id}).populate({path:"products.product",select:'_id name mrp images'})
        if(orders.length==0){
            return res.status(404).json({
                status: true,
                info: 'No orders found'

            })
        }

        return res.status(200).json({
            status: false,
            info: 'Orders found',
            data: orders
        })

    } catch (error) {
        return res.status(500).json({
            status: true,
            info: 'Unable to retrieve the orders'
        })
    }
}

const getOrdersBySeller = async(req,res)=>{
    if(!req.user._id && req.user.role !== 'seller'){
        return res.status(400).json({
            status: true,
            info: 'Seller Login required'
        })
    }
    try {
        let orders = await Order.find({'products.shop':req.params.shopId})
                        .populate({path:'products.product',select:'_id name mrp'})
                        .sort('-created')
                        .exec()
        if(!orders.length>0){
            return res.status(404).json({
                status: true,
                info: 'No orders found'
            })
        }

        return res.status(200).json({
            status: false,
            info: 'Orders found',
            data: orders
        })
        
    } catch (error) {
        return res.status(500).json({
            status: true,
            info: 'Could not find any orders'
        })
    }
}

const updateOrder = async (req,res)=>{
    if(!req.user._id && req.user.role !== 'seller'){
        return res.status(400).json({
            status: true,
            info: 'Seller Login required'
        })
    }
    try {
        
        let order = await Order.updateOne({"products._id":req.body.cartId},{"products.$.status":req.body.status},{new:true});
        // let order = await Order.updateOne({"products.product":args.cartItemID},{"products.$.status":args.status},{new:true});
        
        if(!order){
            return res.status(404).json({
                status: true,
                info: 'No order updated'
            })
        }
        
        return res.status(200).json({
            status: false,
            info: 'Order updated successfully',
            data: order
        })
        
    } catch (error) {
        return res.status(500).json({
            status: true,
            info: 'Could not update the order'
        })
    }
}

const updateCancelOrder = async(req,res)=>{
    if(!req.user._id && req.user.role !== 'seller'){
        return res.status(400).json({
            status: true,
            info: 'Seller Login required'
        })
    }
    try {

        let isCancelled = await Order.findOne({_id:req.params.orderId},{"products":{$elemMatch:{"_id":req.params.cartId}}});
        if(isCancelled.products[0].status=='Cancelled'){
            return res.status(400).json({
                status: true,
                info: "Order is already cancelled"
            })
        }
        
       let productIncrease = await Product.findByIdAndUpdate(req.body._id,{$inc:{"quantity":req.body.quantity}},{new:true})
                    .exec()
        

        if(!productIncrease){
            return res.status(400).json({
                status: true,
                info: 'Could not update the product details'
            })
        }

        let order = await Order.updateOne({"products._id":req.params.cartId},{"products.$.status":req.body.status},{new:true});
        
        if(!order){
            return res.status(400).json({
                status: true,
                info: 'No order updated'
            })
        }

        return res.json({
            status: false,
            info: 'Order updated Successfully'
        })

        
    } catch (error) {
        return res.status(500).json({
            status: true,
            info: 'Could not cancel the order'
        })
    }
}

const updateCancelOrderByUser = async(req,res)=>{
    if(!req.user._id && !req.user.role =='user'){
        return res.status(400).json({
            status: true,
            info: 'User Login is required'
        })
    }
    try {
        let order = await Order.updateOne({"products._id":req.params.cartId},{"products.$.status":'Cancelled'},{new:true});
        if(!order){
            return res.status(400).json({
                status: true,
                info: 'No order executed'
            })
        }
        return res.status(200).json({
            status: false,
            info: 'Order Processed for Cancellation',
            data: order
        })
    } catch (error) {
        return res.status(500).json({
            status: true,
            info: 'Could not cancel the order'
        })
    }
}


const getOrderByIDUser = async(req,res)=>{
    if(!req.user._id || !req.user.role){
        return res.status(401).json({
            status:true,
            info:"Unauthorized Access"
        })
    }
    try {
        
        let orderDetails = await Order.findById({_id:req.params.orderId}).populate("products.product").exec();

        if(!orderDetails){
            return res.status(404).json({
                status:true,
                info:"Order Not Found"
            })
        }

        return res.status(200).json({
            status:false,
            info:"Order Found",
            data:orderDetails
        })

    } catch (error) {

        return res.status(500).json({
            status:true,
            info:"Could not fetch the necessary result"
        })
    }
}

module.exports = {
    addNewOrder,
    getOrderByUserID,
    getOrdersBySeller,
    updateOrder,
    updateCancelOrder,
    updateCancelOrderByUser,
    getOrderByIDUser
}