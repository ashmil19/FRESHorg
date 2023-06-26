const router = require('express').Router();

const authController = require('../../controller/auth/authController');
const userController = require('../../controller/user/userController');
const adminAuth = require('../../middleware/admin');

router.get('/',adminAuth.isLogout,userController.loadHome);


router.get('/signup',adminAuth.isLogout,authController.loadSignUp);
router.post('/signup',authController.createUser);
router.get('/signup/success',adminAuth.isLogout,authController.emailVerifySuccess);

router.get('/login',adminAuth.isLogout,authController.loadLogin);
router.post('/login',authController.verifyLogin);

router.post('/login/otp',authController.otpVerify);




module.exports = router;