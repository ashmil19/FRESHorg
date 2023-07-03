const categoryModel = require('../../models/categoryModel');
const productModel = require('../../models/productModel');


const loadShopDetails = async (req, res)=>{

    try {

        const id = req.query.id;

        const products = await productModel.find();
        const categories = await categoryModel.find();

        await productModel.findOne({_id: id})
        .then((product)=>{
            if(!product){
                res.send("hiiiiiiiiiiiiii");
            }
            res.render('user/shopDetails',{categories, product, products});
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