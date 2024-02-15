const User = require('../../models/user.model');


const getUserByIDAdmin = async(req,res,next,id)=>{
    try {
       
        let userDetails = await User.findById(id);
      
        if(!userDetails){
            return res.status(400).json({
                error:true,
                message:'No user found'
            })
        }
        req.user = userDetails;
        
        
       next();

    } catch (error) {
        // console.log(error)
        return res.status(400).json({
            error:true,
            message:'Could not retrieve products'
        })
    }
}

const getAllUsers = async(req,res)=>{
    try {
        
        let users = await User.find({role:'user'});
        if(!users.length>0){
            return res.status(400).json({
                error:true,
                message:'No users found'
            })
        }

        return res.json({
            error:false,
            message:'Users retrieved successfully',
            data:users
        })

    } catch (error) {
        return res.status(400).json({
            error:true,
            message:'Could not fetch users'
        })
    }
}

const read = async(req,res)=>{
    return res.json({
        error:false,
        message:'Successful',
        data:req.user
    })
}

const getAllSellers = async(req,res)=>{
    try {
        
        let users = await User.find({user_type:'seller'});
        if(!users.length>0){
            return res.status(400).json({
                error:true,
                message:'No users found'
            })
        }

        return res.json({
            error:false,
            message:'Users retrieved successfully',
            data:users
        })

    } catch (error) {
        return res.status(400).json({
            error:true,
            message:'Could not fetch users'
        })
    }
}



module.exports = {
    getUserByIDAdmin,
    read,
    getAllUsers,
    getAllSellers
}