const bannerModel = require('../../models/bannerModel');
const cartModel = require('../../models/cartModel');
const categoryModel = require('../../models/categoryModel');
const productModel = require('../../models/productModel');
const userModel = require('../../models/userModel');
const wishlistModel = require('../../models/wishlistModel');


const loadShop = async (req, res)=>{
    const id = req.session.user_id;
    console.log(req.query);

    let search = '';
    if(req.query.search){
        search = req.query.search;
    }

    let minamount = 0;
    let maxamount = 200;
    
    if(req.query.minamount || req.query.maxamount){
        minamount = parseInt(req.query.minamount);
        maxamount = parseInt(req.query.maxamount);
    }
        
    const user = await userModel.findOne({_id: id});
    const cart = await cartModel.findOne({userId: id});
    const banners = await bannerModel.find();
    const wishlist = await wishlistModel.findOne({userId: id});

    const products = await productModel.find({
        isActive: true,
        productName: {$regex: new RegExp(search, 'i')},
        $and: [
            {price: {$gt: minamount}},
            {price: {$lt: maxamount}},
        ]
    });

    

    const categories = await categoryModel.find();

    res.render('user/shop',{categories, cart, products, user, id, banners, search, minamount, maxamount, wishlist});
}


module.exports = {
    loadShop,
}