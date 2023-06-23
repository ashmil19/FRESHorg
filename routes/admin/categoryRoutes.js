const router = require('express').Router();

const categoryController = require('../../controller/admin/categoryController');

router.get('/',categoryController.loadCategory)

router.get('/add',categoryController.loadAddCategory);
router.post('/add',categoryController.addCategory);

router.get('/edit',categoryController.loadEditCategory);

router.get('/delete',categoryController.deleteCategory);


module.exports = router;