const AuthCtrl = require('../controllers/admin/admin.controller')
const AdminAuthCtrl = require('../controllers/auth/adminauth.controller');
const UserCtrl = require('../controllers/user/user.controller');
const CartCtrlGlobal = require('../controllers/cart/cart.controller')
const Category = require('../controllers/categories/categories.controller')

const Router = require('express').Router();

Router.route('/v1/signup')
    .post(UserCtrl.addNewUser);

Router.route('/v1/signin')
    .post(AdminAuthCtrl.signin)

Router.route('/v1/users')
    .get(AdminAuthCtrl.requireSignin,UserCtrl.getAllUsers)

Router.route('/v1/user/single')
    .get(AdminAuthCtrl.requireSignin,UserCtrl.getUserByToken)

Router.route('/v1/user/:userId')
    .get(AdminAuthCtrl.requireSignin, AdminAuthCtrl.hasAuthorization, UserCtrl.getUserByID);

Router.route('/v1/user/update')
    .patch(AdminAuthCtrl.requireSignin, UserCtrl.getUserByTokenPass, UserCtrl.updateUser);

Router.route('/user/order/invoice/:orderId')
    .get( UserCtrl.getPdfFromHTML)


    
Router.route('/v1/user/address/add')
    .post(AdminAuthCtrl.requireSignin,UserCtrl.getUserByTokenPass,UserCtrl.addNewAddressForUser)

Router.route('/v1/user/address/all')
    .get(AdminAuthCtrl.requireSignin, UserCtrl.getUserByTokenPass, UserCtrl.getAllAddressByUser)

Router.route('/v1/user/address/:addressId/update')
    .patch(AdminAuthCtrl.requireSignin,UserCtrl.getUserByTokenPass,UserCtrl.updateAddressByUser)

Router.route('/v1/user/address/:addressId/delete')
    .delete(AdminAuthCtrl.requireSignin,UserCtrl.getUserByTokenPass,UserCtrl.deleteAddressByUser)

Router.route('/v1/category/add')
    .post(AdminAuthCtrl.requireSignin,AuthCtrl.getAdminCheck,Category.addCategoryByAdmin)

Router.route('/v1/category/:categoryId/update')
    .patch(AdminAuthCtrl.requireSignin,AuthCtrl.getAdminCheck,Category.updateCategoryByAdmin)

Router.route('/v1/category/:categoryId/delete')
    .delete(AdminAuthCtrl.requireSignin, AuthCtrl.getAdminCheck, Category.deleteCategoryByAdmin)

Router.route('/v1/category/alldata')
    .get( Category.getAllCategories)

Router.route('/v1/category/data/primary')
    .get(Category.getAllPrimaryCategories)

Router.route('/v1/category/secondary')
    .get(Category.getAllSubCategories)

Router.route('/v1/category/:categoryId/sub')
    .get(Category.getAllParentToSubCategories)

// Router.param('adminId', AuthCtrl.getAdminByID);

module.exports = Router;