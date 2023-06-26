const router = require('express').Router();

const adminUserController = require('../../controller/admin/userController');


router.get('/',adminUserController.loadUser);

router.get('/edit',adminUserController.loadEditUser);
router.post('/edit',adminUserController.editUser);

module.exports = router;