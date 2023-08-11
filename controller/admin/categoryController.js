const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");

const loadCategory = async (req, res) => {
  try {
    let productsValue = [];
    const categories = await categoryModel.find();
    for (let i = 0; i < categories.length; i++) {
      productsValue[i] = await productModel.findOne({
        category: categories[i]._id,
      });
    }
    res.render("admin/category", { categories, productsValue });
  } catch (error) {
    res.render('user/404page');
  }
};

const loadAddCategory = (req, res) => {
  try {
    res.render("admin/addCategory", { message: null });
  } catch (error) {
    res.render('user/404page');
  }
};

const addCategory = async (req, res) => {
  try {
    const categoryName = req.body.categoryName;
    const catergoryData = await categoryModel.findOne({
      categoryName: { $regex: new RegExp(`^${categoryName}$`, "i") },
    });
    if (catergoryData) {
      res.render("admin/addCategory", {
        message: "This category already exists",
      });
    } else {
      const newCategory = categoryModel({
        categoryName: categoryName,
      });

      await newCategory.save();
      res.redirect("/admin/category");
    }
  } catch (error) {
    res.render('user/404page');
  }
};

const loadEditCategory = async (req, res) => {
  try {
    const id = req.query.id;
    const categoryData = await categoryModel.findOne({ _id: id });
    res.render("admin/editCategory", { message: null, category: categoryData });
  } catch (error) {
    res.render('user/404page');
  }
};

const editCategory = async (req, res) => {
  try {
    const id = req.query.id;
    const categoryName = req.body.categoryName;
    await categoryModel.findByIdAndUpdate(id, { categoryName: categoryName });
    res.redirect("/admin/category");
  } catch (error) {
    res.render('user/404page');
  }
};

module.exports = {
  loadCategory,
  loadAddCategory,
  addCategory,
  loadEditCategory,
  editCategory,
};
