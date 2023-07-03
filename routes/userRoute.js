const router = require('express').Router();

const authController = require('../controller/auth/authController');
const homeController = require('../controller/user/homeController');
const shopController = require('../controller/user/shopController');
const shopDetailsController = require('../controller/user/shopDetailsController');

const adminAuth = require('../middleware/admin');
const userAuth = require('../middleware/user');

router.get('/',adminAuth.isLogout,homeController.loadHome);


router.get('/signup',adminAuth.isLogout,userAuth.isLogout,authController.loadSignUp);
router.post('/signup',authController.createUser);
router.post('/signup/otp',authController.verifyOtp);

router.get('/login',adminAuth.isLogout,userAuth.isLogout,authController.loadLogin);
router.post('/login',authController.verifyLogin);

router.get('/forgotPassword',authController.loadForgotPassword);
router.post('/forgotPassword',authController.forgotPassword);
router.post('/forgotPassword/otp',authController.verifyForgotPasswordOtp);
router.post('/forgotPassword/newPassword',authController.newPassword);


router.get('/shop',shopController.loadShop);
router.get('/shopDetails',shopDetailsController.loadShopDetails);

router.get('/logout',homeController.userLogout);



module.exports = router;