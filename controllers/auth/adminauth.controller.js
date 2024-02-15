
const User = require('../../models/user.model');
const jsonwt = require('jsonwebtoken');
const { expressjwt: jwt } = require('express-jwt');
const config = require('../../config/config')

const signin = async (req, res) => {
  try {
    let user = await User.findOne({
      "email": req.body.email
    })

    if (!user)
      return res.status(401).json({
        error: true,
        message: 'User not found'
      })
      

    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({
        error: true,
        message: 'Email or password is incorrect'
      })
    }

    const token = jsonwt.sign({
      _id: user._id
    }, config.jwtSecret)

    res.cookie("t", token, {
      expire: new Date() + 9999
    })

    let userData = user;
    userData.hashed_password = undefined;
    userData.salt = undefined;
    return res.json({
      error: false,
      message: 'Login success',
      token,
      data: userData
    })
  } catch (err) {
    return res.status(401).json({
      error: true,
      message: 'Could not sign in'
    })
  }
}

const signout = (req, res) => {
  res.clearCookie("t")
  return res.status(200).json({
    error: false,
    message: 'Signed out'

  })
}

const requireSignin = jwt({
  secret: config.jwtSecret,
  userProperty: 'auth',
  algorithms: ['RS256', 'sha1', 'HS256']
})

const hasAuthorization = (req, res, next) => {
  
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id
  if (!(authorized)) {
    return res.status(403).json({
      error: true,
      message: 'User not authorized'
    })
  }
  next()
}

module.exports = {
  signin,
  signout,
  requireSignin,
  hasAuthorization
}