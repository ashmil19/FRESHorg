const router = require('express').Router();

const productController = require('../../controller/admin/productController');
const adminAuth = require('../../middleware/admin');


router.get('/',adminAuth.isLogin,productController.loadProducts);

router.get('/add',adminAuth.isLogin,productController.loadAddProducts);
router.post('/add',productController.addProducts);

router.get('/edit',adminAuth.isLogin,productController.loadEditProduct);
router.post('/edit',productController.editProduct);

router.get('/delete',productController.deleteProduct);


module.exports = router;