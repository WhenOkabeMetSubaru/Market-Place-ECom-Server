const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name:{
        type:String,
        trim:true,
        require:'Product Name is required'
    },
    description:{
        type:String,
        trim:true,
    },
    images:[{
        type:String
    }],
    category:{
        type:String
    },
    quantity:{
        type:Number,
        required:'Quantity is required'
    },
    mrp:{
        type:Number,
        required:'Price is required'
    },
    sellingprice:{
        type:Number,
        required:'Selling price is required'
    },
    shop:{
        type:mongoose.Schema.ObjectId,
        ref:'Shop'
    },
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    Unit:{
        type:String,
    },
    discount:{
        type:String,

    },
    ratings:{
        type:mongoose.Mixed,
        1:Number,
        2:Number,
        3:Number,
        4:Number,
        5:Number,
        
        get:function(r){
            let items = Object.entries(r);
            let sum  =0;
            let total = 0;
            for(let [key,value] of items){
                total += value;
                sum += value * parseInt(key);
            }
            return Math.round(sum/total);
        },
        set:function(r){
            if(!(this instanceof mongoose.Document)){
                if(r instanceof  Object) return r;
                else{throw new Error('')}
            }else{
                if(r instanceof Object){
                    return r
                }
                this.set('ratings',null,{getters:false})[r] = 1 + parseInt(this.get('ratings',null,{getters:false})[r]);
                return this.get('ratings',null,{getters:false})
            }
        },
        validate:{
            validator:function(i){
                let b = [1,2,3,4,5];
                let v = Object.keys(i).sort()
                return b.every((x,j)=>(v.length===b.length) && x===parseInt(v[j]))
            },
            message:'Invalid start level'
        },
        default:{
            1:1,2:1,3:1,4:1,5:1
        },
        
    },
    countryoforigin:{
        type:String,
    },
    manufacture:{
        type:String
    },
    model:{
        type:String
    },
    offers:[{
        type:String,
        trim:true
    }],
    sku:{
        type:String
    },
    weight:{
        type:String,
    },
    review:[{
        _id:false,
        title:{
            type:String,
            trim:true
        },
        description:{
            type:String,
            trim:true
        },
        rating:{
            type:Number,
        },
        userID:{
            type:mongoose.Schema.ObjectId,
            ref:'User'
        },
        created:{
            type:Date,
            default:Date.now
        }
    }],
    status:{
        type:String,
        default:'pending'
    },
    active:{
        type:Boolean,
        default:false
    },
    features:[{
        type:String,
        trim:true
    }],
    updated:Date,
    created:{
        type:Date,
        default:Date.now
    },
    brand:{
        type:String
    },
    yearofrelease:{
        type:String
    },
    warranty:{
        type:String,
        default:'1'
    },
    color:{
        type:String
    },
},{toObject:{getters:true,},toJSON:{getter:true}})


module.exports = mongoose.model('Product',ProductSchema);