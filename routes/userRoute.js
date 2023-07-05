const router = require('express').Router();

const authController = require('../controller/auth/authController');
const homeController = require('../controller/user/homeController');
const shopController = require('../controller/user/shopController');
const shopDetailsController = require('../controller/user/shopDetailsController');
const profileController = require('../controller/user/profileController');
const addressController = require('../controller/user/addressController');
const cartController = require('../controller/user/cartController');

const adminAuth = require('../middleware/admin');
const userAuth = require('../middleware/user');

router.get('/',adminAuth.isLogout,homeController.loadHome);


router.get('/signup',adminAuth.isLogout,userAuth.isLogout,authController.loadSignUp);
router.post('/signup',authController.createUser);
router.post('/signup/otp',authController.verifyOtp);

router.get('/login',adminAuth.isLogout,userAuth.isLogout,authController.loadLogin);
router.post('/login',authController.verifyLogin);

router.get('/forgotPassword',adminAuth.isLogout,authController.loadForgotPassword);
router.post('/forgotPassword',authController.forgotPassword);
router.post('/forgotPassword/otp',authController.verifyForgotPasswordOtp);
router.post('/forgotPassword/newPassword',authController.newPassword);

router.get('/shop',shopController.loadShop);
router.get('/shopDetails',shopDetailsController.loadShopDetails);

router.get('/profile',userAuth.isLogin,profileController.loadProfile);
router.get('/profile/edit',userAuth.isLogin,profileController.loadEditUser);
router.post('/profile/edit',profileController.editUser);
router.get('/profile/oldPassword',userAuth.isLogin,profileController.loadOldPassword);
router.post('/profile/oldPassword',profileController.verifyOldPassword);
router.post('/profile/newPassword',profileController.profileNewPassword);

router.get('/address',userAuth.isLogin,addressController.loadAddress);
router.get('/address/add',userAuth.isLogin,addressController.loadAddAddress);
router.post('/address/add',addressController.addAddress);
router.get('/address/edit',userAuth.isLogin,addressController.loadEditAddress);
router.post('/address/edit',addressController.editAddress);
router.delete('/address/delete',addressController.deleteAddress);

router.get('/cart',cartController.loadCart);
router.get('/cart/add',userAuth.isLogin,cartController.addToCart);

router.get('/logout',homeController.userLogout);



module.exports = router;