const categoryModel = require('../../models/categoryModel');


const loadCategory = async (req, res)=>{

    try{

        const categories = await categoryModel.find();
    
        res.render('admin/category',{categories});

    }catch(err){
        console.log(err);
    }

}

const loadAddCategory = (req, res)=>{
    res.render('admin/addCategory',{message: null, action: "/admin/category/add"});
}

const addCategory = async (req, res)=>{
    try{
        const categoryName = req.body.categoryName;

        const catergoryData = await categoryModel.findOne({categoryName: {$regex: new RegExp(`^${categoryName}$`,"i")}})

        if(catergoryData){
            res.render('admin/addCategory',{message: "This category already exists", action: "/admin/category/add"});
        }else{
            const newCategory = categoryModel({
                categoryName: categoryName,
            })

            await newCategory.save();
            res.redirect('/admin/category');
        }


    }catch(err){
        console.log(err);
    }
}

const loadEditCategory = async (req, res)=>{
    try {

        const id = req.query.id;

        const categoryData = await categoryModel.find({_id: id});

        res.render('admin/addCategory',{message: null, categoryName: categoryData, action: "/admin/category/edit"});
        
    } catch (err) {
        console.log(err);
    }
}

const editCategory = async (req, res)=>{
    try {


        
    } catch (err) {
        console.log(err)
    }
}

const deleteCategory = async (req, res)=>{
    try {
        const id = req.query.id;

        await categoryModel.deleteOne({_id: id});
        res.redirect('/admin/category');
        
    } catch (err) {
        console.log(err);
    }
}



module.exports = {
    loadCategory,
    loadAddCategory,
    addCategory,
    loadEditCategory,
    deleteCategory,
}