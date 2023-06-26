const fileUpload = require('express-fileupload');

const categoryModel = require('../../models/categoryModel');
const productModel = require('../../models/productModel');
const multipleImage = require('../../utils/uploadImage');


const loadProducts = (req, res)=>{
    res.render('admin/product');
}

const loadAddProducts = async (req, res)=>{
    const category = await categoryModel.find();
    const prodcut = await productModel.find();
    res.render('admin/addProduct',{category});
}

const addProducts = async (req, res)=>{
    try{
        
        const productName = req.body.productName;
        const category = req.body.category;
        let price = req.body.price;
        let quantity = req.body.quantity;
        const blurb = req.body.blurb;
        const description = req.body.description;
        
        const images = req.files.image;

        price = parseFloat(price);
        quantity = parseInt(quantity);
        
        const urlList = await multipleImage(images);

        console.log(typeof urlList[0]);

        const newProduct =  productModel({
            productName: productName,
            category: category,
            price: price,
            quantity: quantity,
            blurb: blurb,
            description: description,
            image: urlList,
        })
        
        await newProduct.save()
        res.redirect('/admin/product');
        
    }catch(err){
        console.log(err);
    }


}

module.exports = {
    loadProducts,
    loadAddProducts,
    addProducts,
}

