const categoryModel = require('../../models/categoryModel');
const productModel = require('../../models/productModel');
const userModel = require('../../models/userModel');


const loadShop = async (req, res)=>{
    const id = req.session.user_id;
        
    const user = await userModel.findOne({_id: id});

    const products = await productModel.find();
    const categories = await categoryModel.find();
    res.render('user/shop',{categories, products, user, id});
}


module.exports = {
    loadShop,
}