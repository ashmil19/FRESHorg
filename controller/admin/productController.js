const categoryModel = require('../../models/categoryModel');
const productModel = require('../../models/productModel');
const multipleImage = require('../../utils/uploadImage');


const loadProducts = async (req, res)=>{
    const products = await productModel.find();
    res.render('admin/product',{products});
}

const loadAddProducts = async (req, res)=>{
    const categories = await categoryModel.find();
    res.render('admin/addProduct',{categories});
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


const loadEditProduct = async (req, res)=>{
    const id = req.query.id;

    const categories = await categoryModel.find();
    const product = await productModel.findOne({_id: id});
    res.render('admin/editProduct',{categories,product});
}

const editProduct = async (req, res)=>{

    try {

        const id = req.query.id;

        const productName = req.body.productName;
        const category = req.body.category;
        let price = req.body.price;
        let quantity = req.body.quantity;
        const blurb = req.body.blurb;
        const description = req.body.description;
        

        price = parseFloat(price);
        quantity = parseInt(quantity);


        await productModel.findByIdAndUpdate(id, {
            productName: productName,
            category: category,
            price: price,
            quantity: quantity,
            blurb: blurb,
            description: description,
        })

        res.redirect('/admin/product');

        
    } catch (error) {
        console.log(error);
    }
    
}

const deleteProduct = async (req, res)=>{
    try {
        const {id, active} = req.query;

        if(active == "true"){
            await productModel.findByIdAndUpdate(id, {$set: {isActive: false}});
        }else if(active == "false"){
            await productModel.findByIdAndUpdate(id, {$set: {isActive: true}});
        }
                
        res.redirect('/admin/product');
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loadProducts,
    loadAddProducts,
    addProducts,
    loadEditProduct,
    editProduct,
    deleteProduct,
}

