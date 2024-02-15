const ProductCtrl = require('../controllers/admin/products.controller');
const AuthCtrl = require('../controllers/admin/admin.controller');
const AdminAuthCtrl = require('../controllers/auth/adminauth.controller');
const ShopCtrl = require('../controllers/admin/shop.controller');
const UserCtrl = require('../controllers/admin/user.controller')
const ShopCtrlGlobal = require('../controllers/shop/shop.controller');
const UserCtrlGlobal = require('../controllers/user/user.controller');
const AuthCtrlGlobal = require('../controllers/auth/auth.controller');
const ProductCtrlGlobal = require('../controllers/product/product.controller')

const Router = require('express').Router();


Router.route('/v1/products/home')
    .get(ProductCtrlGlobal.getAllProducts)

Router.route('/v1/products/:productId')
    .get(ProductCtrlGlobal.getProductByID)

Router.route('/v1/shop/:shopId/products/add')
    .post(AuthCtrlGlobal.requireSignin,UserCtrlGlobal.getUserByTokenPass,ProductCtrlGlobal.addNewProduct)

Router.route('/v1/shop/:shopId/products')
    .get(AuthCtrlGlobal.requireSignin,UserCtrlGlobal.getUserByTokenPass,ProductCtrlGlobal.getAllProductsByShop)

Router.route('/v1/:adminId/products')
    .get(AdminAuthCtrl.requireSignin,AdminAuthCtrl.hasAuthorization,AuthCtrl.getAdminCheck,ProductCtrl.getAllProductsByAdmin)

Router.route('/v1/products/:productId')
    .get(AdminAuthCtrl.requireSignin,AdminAuthCtrl.hasAuthorization,ProductCtrl.getProductByID)

Router.route('/v1/:adminId/:shopId/products')
    .get(AdminAuthCtrl.requireSignin,AdminAuthCtrl.hasAuthorization,AuthCtrl.getAdminCheck,ProductCtrl.getProductsByShopAdmin);

Router.route('/v1/:adminId/user/:userId/products')
    .get(AdminAuthCtrl.requireSignin,ProductCtrl.getProductsByUserAdmin)



Router.param('adminId',AuthCtrl.getAdminByID)
Router.param('productId',ProductCtrl.getProductByID);
Router.param('shopId',ShopCtrl.getShopByIDAdmin)
Router.param('userId',UserCtrl.getUserByIDAdmin)

module.exports = Router;