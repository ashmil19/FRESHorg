const categoryModel = require('../../models/categoryModel');
const productModel = require('../../models/productModel');
const userModel = require('../../models/userModel');


const loadShop = async (req, res)=>{
    const id = req.session.user_id;

    let search = '';
    if(req.query.search){
        search = req.query.search;
    }

    let minamount = 0;
    let maxamount = 100;
    
    if(req.query.minamount || req.query.maxamount){
        minamount = parseInt(req.query.minamount.slice(1));
        maxamount = parseInt(req.query.maxamount.slice(1));
    }
        
    const user = await userModel.findOne({_id: id});

    const products = await productModel.find({
        productName: {$regex: new RegExp(search, 'i')},
        $and: [
            {price: {$gt: minamount}},
            {price: {$lt: maxamount}},
        ]
    });

    const categories = await categoryModel.find();

    res.render('user/shop',{categories, products, user, id});
}


module.exports = {
    loadShop,
}