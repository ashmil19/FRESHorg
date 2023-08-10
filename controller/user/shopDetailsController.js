const cartModel = require('../../models/cartModel');
const categoryModel = require('../../models/categoryModel');
const productModel = require('../../models/productModel');
const userModel = require('../../models/userModel');
const wishlistModel = require('../../models/wishlistModel');



const loadShopDetails = async (req, res)=>{
    try {
        const userId = req.session.user_id;
        const user = await userModel.findOne({_id: userId});
        const cart = await cartModel.findOne({userId});
        const wishlist = await wishlistModel.findOne({userId});

        const productId = req.query.id;

        const products = await productModel.find();
        const categories = await categoryModel.find();

        await productModel.findOne({_id: productId})
        .then((product)=>{
            if(!product){
                res.render('user/404page');
            }
            res.render('user/shopDetails',{categories, cart, product, products, userId, user, wishlist});
        })
        .catch(err =>{
            res.render('user/404page');
        })

    } catch (error) {
        console.log(error);
    }
    
}


module.exports = {
    loadShopDetails,
}