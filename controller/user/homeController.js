const categoryModel = require('../../models/categoryModel');
const productModel = require('../../models/productModel');
const userModel = require('../../models/userModel');


const loadHome = async (req, res)=>{

    try{

        const id = req.session.user_id;
        
        const user = await userModel.findOne({_id: id});
        const products = await productModel.find();
        const categories = await categoryModel.find();
        res.render('user/home',{categories, products, user, id});


    }catch(err){
        console.log(err);
    }
}


const userLogout = (req, res)=>{
    try {

        req.session.user_id = null
        res.redirect('/');
        
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    loadHome,
    userLogout,
}