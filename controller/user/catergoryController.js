const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");
const userModel = require("../../models/userModel");
const cartModel = require("../../models/cartModel");


const loadCategory = async (req, res)=>{
    const id = req.session.user_id;

    const catId = req.query.catId;

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

    const products = await productModel.find({
        category: catId,
        productName: {$regex: new RegExp(search, 'i')},
        $and: [
            {price: {$gt: minamount}},
            {price: {$lt: maxamount}},
        ]
    });

    
    const categories = await categoryModel.find();
    const cart = await cartModel.findOne({userId: id});

    res.render('user/shop',{categories, products, user, id, cart, search, minamount, maxamount});
}

module.exports = {
    loadCategory,
}