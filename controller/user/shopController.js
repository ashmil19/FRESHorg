const categoryModel = require('../../models/categoryModel');
const productModel = require('../../models/productModel');


const loadShop = async (req, res)=>{
    const products = await productModel.find();
    const categories = await categoryModel.find();
    res.render('user/shop',{categories, products});
}


module.exports = {
    loadShop,
}