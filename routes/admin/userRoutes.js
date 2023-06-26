const router = require('express').Router();

const adminUserController = require('../../controller/admin/userController');
const adminAuth = require('../../middleware/admin');


router.get('/',adminAuth.isLogin,adminUserController.loadUser);

router.get('/edit',adminAuth.isLogin,adminUserController.loadEditUser);
router.post('/edit',adminUserController.editUser);

module.exports = router;