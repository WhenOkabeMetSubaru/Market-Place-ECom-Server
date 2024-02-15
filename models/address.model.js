const { isInteger } = require('lodash');
const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({

   name:{
    type:String
   },
   mobile:{
    type:String
   },
   pincode:{
    type:String
   },
   locality:{
    type:String
   },
   address:{
    type:String
   },
   city:{
    type:String
   },
   state:{
    type:String
   },
   landmark:{
    type:String
   },
   alternate_phone_number:{
    type:String
   },
   address_type:{
    type:String,
    enum:["home","office","other"],
    default:"home"
   },
   user:{
    type:mongoose.Schema.ObjectId,
    ref:"User"
   }

})

module.exports = mongoose.model('Address', AddressSchema);