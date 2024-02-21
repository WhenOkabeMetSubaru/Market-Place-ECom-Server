const User = require('../../models/user.model');
const extend = require('lodash/extend');
const errorHandler = require('../../helpers/errorHandler');
const jwt = require('jsonwebtoken')
const ejs = require('ejs')
const path = require('path');
// const PuppeteerHTMLPDF = require('puppeteer-html-pdf');
const hbs = require('handlebars');
const Order =require('../../models/order.model')
const Shop = require('../../models/shop.model')
const Address = require("../../models/address.model")

// const htmlPDF = new PuppeteerHTMLPDF();
// htmlPDF.setOptions({ format: 'A4' });

const addNewUser = async (req,res) => {


    const user = new User(req.body);



    try {
        let isfound = await User.findOne({ email: user.email });
        if (isfound) {
            return res.status(400).json({
                status: true,
                info: 'Could not add a review and rating'
            })
        }
        await user.save();
        return res.json({
            status: false,
            info: "User Created Successfully",
            data: user
        })
    } catch (err) {
        return res.status(500).json({
            status: true,
            info: errorHandler.getErrorMessage(err),

        })
    }
}

const getAllUsers = async (req, res) => {
    try {

        let users = await User.find().select('_id name email updated created user_type');
        // console.log(users)
        return res.json({
            status: false,
            info: "User retrieved Successfully",
            data: users
        })


    } catch (err) {
        return res.status(500).json({
            status: true,
            info: errorHandler.getErrorMessage(err)
        })
    }
}

const getUserByID = async (req,res) => {
    if (!req.user._id && !req.user.role) {
        return res.status(400).json({
            status: true,
            info: "Login is required"
        })
    }
    try {

       

        let user = await User.findById(req.user._id).select('_id name email user_type')
        if (!user) {
            return res.status(404).json({
                status: true,
                info: "No User Found"
            })
        }

        user.hashed_password = undefined;
        user.salt = undefined;
        return res.json({
            status: false,
            info: "User Successfully Retrieved",
            data: user
        })
    } catch (err) {
        return res.status(500).json({
            status: true,
            info: "Could not retrieve User"
        })
    }
}

const read = async (req, res) => {


    req.user.hashed_password = undefined;
    req.user.salt = undefined;

    return res.json({
        status: false,
        info: 'Data retrieving Successful',
        data: req.user
    });
}

const updateUser = async (req,res) => {

    if(!req.user._id && !req.user.role){
        return res.status(400).json({
            status: true,
            info: 'Login is required'
        })
    }

    try {
   
        if(req.user._id?.toString() !== req.body._id){
            return res.status(401).json({
                status: true,
                info: 'User not authorized'
            })
        }
    
        // let user = args.UserUpdateInput._id;
        // user = extend(user, args.UserUpdateInput);
        // user.updated = Date.now();
        // await user.save();
     
        delete req.body._id;
       
 
        let user = await User.findByIdAndUpdate({_id:req.user._id},req.body,{new:true});
        await user.save();
        
        
        return res.json({
            status: false,
            info: 'User updated Successfully',
            data: user
        })

    } catch (err) {
        return res.status(500).json({
            status: true,
            info: errorHandler.getErrorMessage(err)
        })
    }
}

const remove = async (req, res) => {
    try {
        let user = req.user;
        let deletedUser = user.remove();
        deletedUser.hashed_password = undefined;
        deletedUser.salt = undefined;
        return res.json({
            status: false,
            info: 'Delete Successfully',
            data: deletedUser
        });

    } catch (err) {
        res.status(400).json({
            status: true,
            info: errorHandler.getErrorMessage(err)
        })
    }
}


const getUserByToken = async (req, res) =>
{
   
    try
    {
      

        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET

        )

       

        let user = await User.findById(decodedToken._id).select('-password -salt')
       
        if (!user)
        {
            return res.status(404).json({
                status: true,
                info: "No User Found"
            })
        }

        user.hashed_password = undefined;
        user.salt = undefined;
        return res.json({
            status: false,
            info: "User Successfully Retrieved",
            data: user
        })
    } catch (err)
    {
        console.log(err)
        return res.status(500).json({
            status: true,
            info: "Could not retrieve User"
        })
    }
}

const getUserByTokenPass = async (req, res,next) =>
{


    try
    {


        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET

        )



        let user = await User.findById(decodedToken._id).select('_id name email role')

        if (!user)
        {
            return res.status(404).json({
                status: true,
                info: "No User Found"
            })
        }
       
        req.user = user;
        // req.user.hashed_password = undefined;
        // req.user.salt = undefined;
        next();
    } catch (err)
    {
        console.log(err)
        return res.status(500).json({
            status: true,
            info: "Could not retrieve User"
        })
    }
}

const getPdfFromHTML = async(req,res)=>{
    // try {
    //     // let pathnoi = path.join(__dirname,"../../templates/invoice.html");
    //     // console.log(pathnoi)
    //     // res.sendFile(pathnoi)
      
    //     // return res.render("C:\\Users\\hardi\\OneDrive\\Documents\\Projects\\MarketPlace\\server\\views\\invoice.ejs")

    //     // res.render("invoice",{invoice:{"red":2}})

    //     const orderDetails = await Order.findById({_id:req.params.orderId}).populate(["products.product","ordered_by","delivery_address"]);
    //     const shopDetails = await Shop.findById({_id:orderDetails?.products?.product?.shop});

    //     ejs.renderFile("C:\\Users\\hardi\\OneDrive\\Documents\\Projects\\MarketPlace\\server\\views\\invoice.ejs",{order:orderDetails,user:orderDetails?.ordered_by,shop:shopDetails},async(err,str)=>{
    //         if(err){
    //             return res.send(err);
    //         }

    //         htmlPDF.setOptions({format:"A4"})

    //         const pdfDoc = await htmlPDF.create(str);
    //         const filePath = `C:\\Users\\hardi\\OneDrive\\Documents\\Projects\\MarketPlace\\server\\views\\`+orderDetails?._id + ".pdf";
    //         await htmlPDF.writeFile(pdfDoc, filePath);
           
    //         return res.download(filePath,()=>{})

    //     })

    //     // const pdfData = {
    //     //     invoiceItems: [
    //     //         { item: 'Website Design', amount: 5000 },
    //     //         { item: 'Hosting (3 months)', amount: 2000 },
    //     //         { item: 'Domain (1 year)', amount: 1000 },
    //     //     ],
    //     //     invoiceData: {
    //     //         invoice_id: 123,
    //     //         transaction_id: 1234567,
    //     //         payment_method: 'Paypal',
    //     //         creation_date: '04-05-1993',
    //     //         total_amount: 141.5,
    //     //     },
    //     //     baseUrl: 'https://ultimateakash.com'
    //     // }
    //     // const html = await htmlPDF.readFile("C:\\Users\\hardi\\OneDrive\\Documents\\Projects\\MarketPlace\\server\\views\\"+ 'invoiceNew.html', 'utf8');
    //     // const template = hbs.compile(html);
    //     // const content = template(pdfData);

    //     // const pdfBuffer = await htmlPDF.create(content);
    //     // const filePath = `C:\\Users\\hardi\\OneDrive\\Documents\\Projects\\MarketPlace\\server\\views\\sample.pdf`
    //     // await htmlPDF.writeFile(pdfBuffer, filePath);
    
    //     // return res.download(filePath,(err)=>{
    //     //     console.log(err)
    //     // })

    // } catch (error) {
    //     console.log(error)
    //    return res.json({
    //         status:false,
    //         info:"failed"
    //     })
    // }
}

const addNewAddressForUser = async(req,res)=>{
    if(!req.user._id || !req.user.role){
        return res.status(401).json({
            status:true,
            info:"Not Authorized"
        })
    }
    try {
        
        let details = req.body;
        details.user = req.user._id;
        let addedValue = new Address(details);
        
        let result = await addedValue.save();

        return res.json({
            status:false,
            info:"Successfully added",
            data:result
        })

    } catch (error) {
        return res.status(500).json({
            statsu:true,
            info:"Cannot add the address"
        })
    }
}

const updateAddressByUser = async (req, res) =>
{
    if (!req.user._id || !req.user.role)
    {
        return res.status(401).json({
            status: true,
            info: "Not Authorized"
        })
    }
    try
    {

        let result = await Address.findByIdAndUpdate({_id:req.params.addressId},req.body,{new:true})
       

        return res.json({
            status: false,
            info: "Successfully added",
            data: result
        })

    } catch (error)
    {
        return res.status(500).json({
            statsu: true,
            info: "Cannot add the address"
        })
    }
}

const deleteAddressByUser = async (req, res) =>
{
    if (!req.user._id || !req.user.role)
    {
        return res.status(401).json({
            status: true,
            info: "Not Authorized"
        })
    }
    try
    {

        let result = await Address.findByIdAndDelete({ _id: req.params.addressId },{ new: true })


        return res.json({
            status: false,
            info: "Successfully deleted",
            data: result
        })

    } catch (error)
    {
        return res.status(500).json({
            statsu: true,
            info: "Cannot add the address"
        })
    }
}


const getAllAddressByUser = async (req, res) =>
{
    if (!req.user._id || !req.user.role)
    {
        return res.status(401).json({
            status: true,
            info: "Not Authorized"
        })
    }
    try
    {

        let result = await Address.find({user:req.user._id}).sort('created');

        if(!result.length>0){
            return res.status(404).json({
                status:true,
                info:"Not Found"
            })
        }

        return res.json({
            status: false,
            info: "Successfully fetch",
            data: result
        })

    } catch (error)
    {
        return res.status(500).json({
            statsu: true,
            info: "Cannot add the address"
        })
    }
}


module.exports = { addNewUser, read, getAllUsers, remove, updateUser, getUserByID,getUserByToken,getUserByTokenPass,getPdfFromHTML,
addNewAddressForUser,
updateAddressByUser,
deleteAddressByUser,
getAllAddressByUser
}