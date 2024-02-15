const AuthCtrl = require('../controllers/admin/admin.controller')
const AdminAuthCtrl = require('../controllers/auth/adminauth.controller');
const UserCtrl = require('../controllers/admin/user.controller')

const Router = require('express').Router();

Router.route('/v1/signup')
    .post(AuthCtrl.addAdmin);

Router.route('/v1/login')
    .post(AdminAuthCtrl.signin)

Router.route('/v1/alladmin')
    .get(AdminAuthCtrl.requireSignin,AuthCtrl.getAllAdmin)

Router.route('/v1/:adminId/users')
    .get(AdminAuthCtrl.requireSignin,AuthCtrl.getAdminByID,AuthCtrl.getAdminCheck,UserCtrl.getAllUsers);

Router.route('/v1/:adminId/sellers')
    .get(AdminAuthCtrl.requireSignin,AuthCtrl.getAdminByID,AuthCtrl.getAdminCheck,UserCtrl.getAllSellers);
    
Router.route('/v1/admindetails')
    .get(AuthCtrl.getAdminDetails);
    


module.exports = Router;