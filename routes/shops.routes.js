const ProductCtrl = require('../controllers/admin/products.controller');
const AuthCtrl = require('../controllers/admin/admin.controller');
const AdminAuthCtrl = require('../controllers/auth/adminauth.controller');
const ShopCtrl = require('../controllers/admin/shop.controller');
const UserCtrl = require('../controllers/admin/user.controller');
const UserCtrlGlobal = require('../controllers/user/user.controller');
const ShopCtrlGlobal = require('../controllers/shop/shop.controller');
const UserAuthCtrl = require('../controllers/auth/auth.controller')

const Router = require('express').Router();

Router.route('/v1/seller/shops')
    .get(UserCtrlGlobal.getUserByTokenPass, ShopCtrl.getAllShopsByOwner)

Router.route('/v1/seller/shop/add')
    .post(UserAuthCtrl.requireSignin,UserCtrlGlobal.getUserByTokenPass,ShopCtrlGlobal.addNewShop)

Router.route('/v1/:adminId/shops')
    .get(AdminAuthCtrl.requireSignin,AuthCtrl.getAdminByID, ShopCtrl.getAllShopsByAdmin)

Router.route('/v1/:adminId/:userId/shops')
    .get(AdminAuthCtrl.requireSignin,AuthCtrl.getAdminByID,UserCtrl.getUserByIDAdmin, ShopCtrl.getAllShopsByOwner)





// Router.param('adminId',AuthCtrl.getAdminByID);
// Router.param('userId',UserCtrl.getUserByIDAdmin);





module.exports = Router;