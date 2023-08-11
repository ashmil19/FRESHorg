const bannerModel = require("../../models/bannerModel");
const categoryModel = require("../../models/categoryModel");
const cloudinaryUpload = require("../../utils/uploadImage");

const loadBanner = async (req, res) => {
  try {
    const banners = await bannerModel.find().populate("targetCategory");
    res.render("admin/banner", { banners });
  } catch (error) {
    res.render("user/404page");
  }
};

const loadAddBanner = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.render("admin/addBanner", { categories });
  } catch (error) {
    res.render("user/404page");
  }
};

const addBanner = async (req, res) => {
  try {
    const { title, targetCategory, description } = req.body;
    const { image } = req.files;
    const bannerImage = await cloudinaryUpload.imageUpload(image);
    const newBanner = new bannerModel({
      title,
      bannerImage,
      description,
      targetCategory,
    });

    newBanner.save();
    res.redirect("/admin/banner");
  } catch (error) {
    res.render("user/404page");
  }
};

const loadEditBanner = async (req, res) => {
  try {
    const { bannerId } = req.query;
    const banner = await bannerModel.findOne({ _id: bannerId });
    res.render("admin/editBanner", { banner });
  } catch (error) {
    res.render("user/404page");
  }
};

const editBanner = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { bannerId } = req.query;
    await bannerModel.findByIdAndUpdate(bannerId, {
      title: title,
      description: description,
    });

    res.redirect("/admin/banner");
  } catch (error) {
    res.render("user/404page");
  }
};

module.exports = {
  loadBanner,
  loadAddBanner,
  addBanner,
  loadEditBanner,
  editBanner,
};
