const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");
const userModel = require("../../models/userModel");
const cartModel = require("../../models/cartModel");
const wishlistModel = require("../../models/wishlistModel");


const loadCategory = async (req, res)=>{
    try {
        const id = req.session.user_id;
        const ITEMS_PER_PAGE = 6;
        const page = +req.query.page || 1;
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
        const wishlist = await wishlistModel.findOne({userId: id});
        
        const totalProducts = await productModel.countDocuments({isActive: true, category: catId});
        const products = await productModel.find({
            isActive: true,
            category: catId,
            productName: {$regex: new RegExp(search, 'i')},
            $and: [
                {price: {$gt: minamount}},
                {price: {$lt: maxamount}},
            ]
        })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    
        
        const categories = await categoryModel.find();
        const cart = await cartModel.findOne({userId: id});
    
        res.render('user/shop',{
            products,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1,
            lastPage: Math.ceil(totalProducts/ITEMS_PER_PAGE),
            categories, 
            user, 
            id, 
            cart, 
            search, 
            minamount, 
            maxamount, 
            wishlist
        });
        
    } catch (error) {
       console.log(error); 
    }
}

module.exports = {
    loadCategory,
}