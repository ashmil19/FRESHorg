const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");
const userModel = require("../../models/userModel");
const cartModel = require("../../models/cartModel");


const loadCategory = async (req, res)=>{
    const id = req.session.user_id;

    const catId = req.query.catId;
        
    const user = await userModel.findOne({_id: id});

    const products = await productModel.find({category: catId});
    const categories = await categoryModel.find();
    const cart = await cartModel.findOne({userId: id});

    res.render('user/shop',{categories, products, user, id, cart});
}

module.exports = {
    loadCategory,
}