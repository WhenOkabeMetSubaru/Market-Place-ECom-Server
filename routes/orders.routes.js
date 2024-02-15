const OrderCtrl = require('../controllers/admin/orders.controller');
const AuthCtrl = require('../controllers/admin/admin.controller');
const AdminAuthCtrl = require('../controllers/auth/adminauth.controller');
const ShopCtrl = require('../controllers/admin/shop.controller');
const UserCtrl = require('../controllers/admin/user.controller');

const ShopCtrlGlobal = require('../controllers/shop/shop.controller');
const UserCtrlGlobal = require('../controllers/user/user.controller');
const AuthCtrlGlobal = require('../controllers/auth/auth.controller');
const ProductCtrlGlobal = require('../controllers/product/product.controller')
const OrderCtrlGlobal = require("../controllers/order/order.controller");

const Router = require('express').Router();


Router.route('/v1/order/customer/add')
    .post(AuthCtrlGlobal.requireSignin,UserCtrlGlobal.getUserByTokenPass,OrderCtrlGlobal.addNewOrder)

Router.route('/v1/order/user')
    .get(UserCtrlGlobal.getUserByTokenPass,OrderCtrlGlobal.getOrderByUserID)

Router.route('/v1/order/:orderId')
    .get(AuthCtrlGlobal.requireSignin,UserCtrlGlobal.getUserByTokenPass,OrderCtrlGlobal.getOrderByIDUser)

Router.route('/v1/:adminId/orders')
    .get(AdminAuthCtrl.requireSignin,AdminAuthCtrl.hasAuthorization,OrderCtrl.getAllOrders);

Router.route('/v1/:adminId/shop/:shopId/orders')
    .get(AdminAuthCtrl.requireSignin,AdminAuthCtrl.hasAuthorization,AuthCtrl.getAdminCheck,OrderCtrl.getAllOrderDetailsByShop);

Router.route('/v1/:adminId/user/:userId/orders')
    .get(AdminAuthCtrl.requireSignin,OrderCtrl.getAllOrderDetailsByUser);


Router.param('shopId',ShopCtrl.getShopByIDAdmin);
Router.param('adminId',AuthCtrl.getAdminByID);
Router.param('userId',UserCtrl.getUserByIDAdmin);   


module.exports = Router;