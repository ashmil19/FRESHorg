const categoryModel = require('../../models/categoryModel');
const productModel = require('../../models/productModel');
const userModel = require('../../models/userModel');



const loadShopDetails = async (req, res)=>{

    try {

        const userId = req.session.user_id;
        
        const user = await userModel.findOne({_id: userId});

        const id = req.query.id;

        const products = await productModel.find();
        const categories = await categoryModel.find();

        await productModel.findOne({_id: id})
        .then((product)=>{
            if(!product){
                res.send("hiiiiiiiiiiiiii");
            }
            res.render('user/shopDetails',{categories, product, products, userId, user});
        })
        .catch(err =>{
            res.send("holiii");
        })
        
        

        

    } catch (error) {
        console.log(error);
    }
    
}


module.exports = {
    loadShopDetails,
}