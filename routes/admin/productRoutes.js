const router = require('express').Router();

const productController = require('../../controller/admin/productController');


router.get('/',productController.loadProducts);

router.get('/add',productController.loadAddProducts);
router.post('/add',productController.addProducts);


module.exports = router;