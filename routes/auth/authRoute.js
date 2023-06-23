const router = require('express').Router();

const authController = require('../../controller/auth/authController');

router.get('/signup',authController.loadSignUp);
router.post('/signup',authController.createUser);
router.get('/signup/success',authController.emailVerifySuccess);

router.get('/login',authController.loadLogin);
router.post('/login',authController.verifyLogin);

router.post('/login/otp',authController.otpVerify);




module.exports = router;