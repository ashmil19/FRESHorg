const router = require('express').Router();

const adminController = require('../../controller/admin/productController');


router.get('/',adminController.loadProducts);


module.exports = router;