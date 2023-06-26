const router = require('express').Router();

const categoryController = require('../../controller/admin/categoryController');
const adminAuth = require('../../middleware/admin');

router.get('/',adminAuth.isLogin,categoryController.loadCategory)

router.get('/add',adminAuth.isLogin,categoryController.loadAddCategory);
router.post('/add',categoryController.addCategory);

router.get('/edit',adminAuth.isLogin,categoryController.loadEditCategory);
router.post('/edit',categoryController.editCategory);



module.exports = router;