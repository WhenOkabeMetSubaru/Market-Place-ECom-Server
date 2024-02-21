
const mongoose = require('mongoose');
const mongoUri = "mongodb+srv://steinsZero:okabe3000subaru0@empty.jjguuyb.mongodb.net/MarketPlace"

const connectToMongo = ()=>{

    mongoose.connect(mongoUri,()=>{
        console.log("Connected to mongo successfully")
    })
}

module.exports = connectToMongo;