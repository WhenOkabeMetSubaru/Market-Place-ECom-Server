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
const CartCtrlGlobal = require("../controllers/cart/cart.controller")

const Router = require('express').Router();

Router.route('/v1/user/cart/unique')
    .get(UserCtrlGlobal.getUserByTokenPass, CartCtrlGlobal.getCartByUser)

Router.route('/v1/user/cart/add')
    .post(AuthCtrlGlobal.requireSignin, UserCtrlGlobal.getUserByTokenPass, CartCtrlGlobal.addNewCart)

Router.route('/v1/user/cart/update')
    .post(AuthCtrlGlobal.requireSignin,UserCtrlGlobal.getUserByTokenPass,CartCtrlGlobal.updateCartByUser)


module.exports = Router;