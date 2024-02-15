const express = require('express');
const connectToMongo = require('./db');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const multer = require('multer');
const dotenv = require('dotenv').config()
const path = require('path')

// const UserRoutes = require('./routes/userRoutes');
// const AuthRoutes = require('./routes/authRoutes');
// const CourseRoutes = require('./routes/courseRoutes');
connectToMongo();


const app = express();
const PORT = 4000;
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(compress());
app.use(express.static('uploads'));
app.use(helmet())

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*') /
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
        
    )
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    
   
    next()
})
app.use(cors())

const AuthRoutes = require('./routes/admin.routes');
const ProductsRoutes = require('./routes/products.routes');
const ShopsRoutes = require('./routes/shops.routes');
const OrderRoutes = require('./routes/orders.routes');
const CategoryRoutes = require('./routes/categories.routes');
const UserRoutes = require('./routes/user.routes');
const CartRoutes = require('./routes/cart.routes')

app.use('/auth', AuthRoutes);
app.use('/api', ProductsRoutes);
app.use('/api', ShopsRoutes);
app.use('/api', OrderRoutes);
app.use('/api', CategoryRoutes);
app.use('/api', UserRoutes)
app.use('/api',CartRoutes)





const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,+ Date.now()+file.originalname )
    }
})

const upload = multer({storage:storage});

app.post('/uploads/multiple',upload.array('testimages'),(req,res)=>{
    let fileData =req.files?.map((data)=>{
        return `http://localhost:4000/${data.filename}`
    })

    return res.json({
        data:fileData
    })
});

app.post('/uploads/single',upload.single('testimage'),(req,res)=>{
    return res.json({
        url:`http://localhost:4000/${req.file.filename}`
    })
})
// 





const securedServer = http.createServer(app);



securedServer.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
   
})




// app.listen(PORT,()=>{
//     console.log(`Listening on Port http://localhost:${PORT}`)
// })