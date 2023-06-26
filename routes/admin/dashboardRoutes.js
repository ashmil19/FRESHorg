const router = require('express').Router();

const dashboardController = require('../../controller/admin/dashboardController');
const adminAuth = require('../../middleware/admin');

router.get('/',adminAuth.isLogin,dashboardController.loadDashboard);

router.get('/adminLogout',dashboardController.adminLogout);

module.exports = router;