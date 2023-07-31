const bannerModel = require('../../models/bannerModel');
const categoryModel = require('../../models/categoryModel');
const cloudinaryUpload = require('../../utils/uploadImage');

const loadBanner = async (req, res)=>{
    try {
        const banners = await bannerModel.find().populate("targetCategory");
        res.render('admin/banner',{banners});
    } catch (error) {
        
    }
}

const loadAddBanner = async (req, res)=>{
    const categories = await categoryModel.find();
    res.render('admin/addBanner',{categories});
}

const addBanner = async (req, res)=>{
    try {

        const {
            title,
            targetCategory,
            description,

        } = req.body;

        const { image } = req.files;

        const bannerImage = await cloudinaryUpload.imageUpload(image);

        const newBanner = new bannerModel({
            title,
            bannerImage,
            description,
            targetCategory,
        })

        newBanner.save();
        res.redirect('/admin/banner');

    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    loadBanner,
    loadAddBanner,
    addBanner,
}