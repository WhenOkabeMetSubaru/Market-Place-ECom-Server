const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");


const addNewCart = async (req, res) =>
{
    if (!req.user._id && req.user.role !== 'user')
    {
        return res.status(400).json({
            status: true,
            info: 'User Login Required'
        })
    }
    try
    {

        let isExists = await Cart.findOne({ user: req.user._id });
        if (isExists)
        {
            return res.status(400).json({
                status: true,
                info: 'Cart Already Exists',
                data: isExists
            })
        }
        let cartDetails = new Cart({ user: req.user._id });

        let result = await cartDetails.save();

        return res.status(200).json({
            status: false,
            info: 'Cart Successfully Created',
            data: result
        })

    } catch (error)
    {
        return res.status(500).json({
            status: true,
            info: 'Could not create cart for some unknown reason'
        })
    }
}

const getAllCarts = async (req, res) =>
{
    if (!req.user._id && req.user.role !== 'user')
    {
        return res.status(404).json({
            status: true,
            info: 'User Login Required'
        })
    }
    try
    {

        let cartDetails = await Cart.find().populate({ path: 'products.product' });

        if (!cartDetails?.length > 0)
        {
            return res.status(404).json({
                status: true,
                info: "No Carts Found"
            })
        }


        return res.json({
            status: false,
            info: 'Cart Found',
            data: cartDetails
        })

    } catch (error)
    {
        return res.status(500).json({
            status: true,
            info: 'Could not fetch cart details for some unknown reason'
        })
    }
}

const getCartByUser = async (req, res) =>
{
   
    if (!req.user._id && req.user.role !== 'user')
    {
        return res.status(401).json({
            status: true,
            info: 'User Login Required'
        })
    }
    try
    {

        let cartDetails = await Cart.findOne({ user: req.user._id }).populate({ path: 'products.product' });

        if (!cartDetails)
        {
            return res.status(404).json({
                status: true,
                info: "No Cart Found"
            })
        }


        return res.json({
            status: false,
            info: 'Cart Found',
            data: cartDetails
        })

    } catch (error)
    {
        return res.status(500).json({
            status: true,
            info: 'Could not fetch cart details for some unknown reason'
        })
    }
}


const getCartByID = async (req, res) =>
{
    if (!req.user._id && req.user.role !== 'user')
    {
        return res.status(401).json({
            status: true,
            info: 'User Login Required'
        })
    }
    try
    {

        let cartDetails = await Cart.findById({ _id: req.params.cartId }).populate({ path: 'products.product' })

        if (!cartDetails)
        {
            return res.status(404).json({
                status: true,
                info: "No Cart Found"
            })
        }


        return res.json({
            status: false,
            info: 'Cart Found',
            data: cartDetails
        }
        )
    } catch (error)
    {
        return res.status(500).json({
            status: true,
            info: 'Could not fetch cart details for some unknown reason'
        })
    }
}

const updateCartByUser = async (req, res) =>
{
    if (!req.user._id && req.user.role !== 'user')
    {
        return res.status(401).json({
            status: true,
            info: 'User Login Required'
        })
    }
    try
    {

        if(!req.body.cartId){
            let cartDetails = new Cart({ user: req.user._id });

            let cartResponse  = await cartDetails.save();

            req.body.cartId = cartResponse._id
        }

        let cartDetails = await Cart.findById({ _id: req.body.cartId });
        let productDetails = await Product.findById({ _id: req.body.product });

        let isExists = cartDetails?.products?.find((item) =>
        {
            return item.product == req.body.product
        });

        if (isExists)
        {
            if (req.body.quantity !== 0)
            {

                let updatedDetails = await Cart.findOneAndUpdate({ _id: req.body.cartId, 'products.product': req.body.product }, {
                    $set: {
                        'products.$.quantity': req.body.quantity
                    },
                    total_quantity: cartDetails.total_quantity - isExists.quantity + req.body.quantity,
                    total_amount: cartDetails.total_amount - (isExists.quantity * productDetails.sellingprice) + (req.body.quantity * productDetails.sellingprice),
                    total_discount: cartDetails.total_discount - (isExists.quantity * productDetails.mrp - isExists.quantity * productDetails.sellingprice) + (req.body.quantity * productDetails.mrp - req.body.quantity * productDetails.sellingprice),
                    total_items: cartDetails.products.length
                }, { new: true }).populate({ path: 'products.product' })

                return res.status(200).json({
                    status: false,
                    info: 'Cart Updated Successfully',
                    data: updatedDetails
                })

            } else if (req.body.quantity == 0 && (cartDetails.total_quantity - isExists.quantity !== 0))
            {
                let updatedDetails = await Cart.findByIdAndUpdate({ _id: req.body.cartId }, {
                    $pull: {
                        products: {
                            product: req.body.product
                        }
                    },
                    total_quantity: cartDetails.total_quantity - isExists.quantity + req.body.quantity,
                    total_amount: cartDetails.total_amount - (isExists.quantity * productDetails.sellingprice) + (req.body.quantity * productDetails.sellingprice),
                    total_discount: cartDetails.total_discount - (isExists.quantity * productDetails.mrp - isExists.quantity * productDetails.sellingprice) + (req.body.quantity * productDetails.mrp - req.body.quantity * productDetails.sellingprice),
                    total_items: cartDetails.products.length - 1
                }, { new: true })

                return res.status(200).json({
                    status: false,
                    info: 'Cart Updated Successfully',
                    data: updatedDetails
                })

            } else if (req.body.quantity == 0 && (cartDetails.total_quantity - isExists.quantity == 0))
            {

                let updatedDetails = await Cart.findByIdAndDelete({ _id: req.body.cartId }, { new: true });

                return res.status(200).json({
                    status: false,
                    info: 'Cart Deleted Successfully',
                    data: updatedDetails
                })

            }
        }

        let updatedDetails = await Cart.findByIdAndUpdate({ _id: req.body.cartId }, {
            $push: {
                products: {
                    product: req.body.product,
                    quantity: req.body.quantity
                }
            },
            total_quantity: cartDetails.total_quantity + req.body.quantity,
            total_amount: cartDetails.total_amount + (req.body.quantity * productDetails.sellingprice),
            total_discount: cartDetails.total_discount + (req.body.quantity * productDetails.mrp - req.body.quantity * productDetails.sellingprice),
            total_items: cartDetails.products.length + 1
        }, { new: true })

        return res.status(200).json({
            status: false,
            info: 'Cart Updated Successfully',
            data: updatedDetails
        })

    } catch (error)
    {
        console.log(error)
        return res.status(500).json({
            status: true,
            info: 'Could not update cart details for some unknown reason'
        })
    }
}


const deleteCartByID = async (req, res) =>
{
    if (!req.user._id && req.user.role !== 'user')
    {
        return res.status(401).json({
            status: true,
            info: 'User Login Required'
        })
    }
    try
    {

        let cartDetails = await Cart.findByIdAndDelete({ _id: req.params.cartId }, { new: true }).populate({ path: 'products.product' })



        return res.status(200).json({
            status: false,
            info: 'Cart Deleted',
            data: cartDetails
        })

    } catch (error)
    {
        return res.status(500).json({
            status: true,
            info: 'Could not delete cart for some unknown reason'
        })
    }
}

module.exports = {
    addNewCart,
    getAllCarts,
    getCartByUser,
    getCartByID,
    updateCartByUser,
    deleteCartByID
}