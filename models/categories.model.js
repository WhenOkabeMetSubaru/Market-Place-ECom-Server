const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    
    name:{
        type:String,
        trim:true
    },
    category_type:{
        type:String
    },
    image:{
        type:String
    },
    created:{
        type:Date,
        default:Date.now()
    },
    parent_category:{
       type:this,
       default:null
    },
    totalProducts:{
        type:Number,
        default:0
    },
    updated:Date
});

module.exports = mongoose.model('Category',CategorySchema);