const router = require('express').Router();

const dashboardController = require('../controller/admin/dashboardController');
const categoryController = require('../controller/admin/categoryController');
const productController = require('../controller/admin/productController');
const adminUserController = require('../controller/admin/userController');
const orderController = require('../controller/admin/orderController')

const adminAuth = require('../middleware/admin');


router.get('/dashboard',adminAuth.isLogin,dashboardController.loadDashboard);

router.get('/category',adminAuth.isLogin,categoryController.loadCategory)
router.get('/category/add',adminAuth.isLogin,categoryController.loadAddCategory);
router.post('/category/add',categoryController.addCategory);
router.get('/category/edit',adminAuth.isLogin,categoryController.loadEditCategory);
router.post('/category/edit',categoryController.editCategory);

router.get('/product',adminAuth.isLogin,productController.loadProducts);
router.get('/product/add',adminAuth.isLogin,productController.loadAddProducts);
router.post('/product/add',productController.addProducts);
router.get('/product/edit',adminAuth.isLogin,productController.loadEditProduct);
router.post('/product/edit',productController.editProduct);
router.get('/product/image',productController.loadImages);
router.delete('/product/image/delete',productController.deleteProductImage)
router.get('/product/image/add',productController.loadAddImage);
router.post('/product/image/add',productController.editImage);
router.get('/product/delete',productController.deleteProduct);

router.get('/order',adminAuth.isLogin,orderController.loadorder);
router.get('/orderDetails',adminAuth.isLogin,orderController.loadOrderDetails);
router.post('/order/status',orderController.statusChange);

router.get('/user',adminAuth.isLogin,adminUserController.loadUser);
router.get('/user/edit',adminAuth.isLogin,adminUserController.loadEditUser);
router.post('/user/edit',adminUserController.editUser);


router.get('/logout',dashboardController.adminLogout);

module.exports = router;