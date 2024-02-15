const CategoryCtrl = require('../controllers/admin/categories.controllers');
const AuthCtrl = require('../controllers/admin/admin.controller');
const AdminAuthCtrl = require('../controllers/auth/adminauth.controller');
const ShopCtrl = require('../controllers/admin/shop.controller');
const UserCtrl = require('../controllers/admin/user.controller');

const Router = require('express').Router();


Router.route('/v1/:adminId/categories')
    .get(AdminAuthCtrl.requireSignin,CategoryCtrl.getAllCategories);






module.exports = Router;