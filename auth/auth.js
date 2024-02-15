const jwt = require('jsonwebtoken')
const config = require('../config/config')

module.exports = (req,res) => {

    try {

        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            
      
            const token = req.headers.authorization.split(' ')[1]
            const decodedToken = jwt.verify(
                token,
                config.jwtSecret
                
            )
            
            const authData = {
                role: decodedToken.user_type,
                _id: decodedToken._id
            }
            return authData


        }

    } catch (err) {
        const authData = {
            user_id: null,
            type: ''
        }
        return authData
    }

}