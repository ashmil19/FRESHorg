const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");
const userModel = require("../../models/userModel");
const cartModel = require("../../models/cartModel");
const bannerModel = require("../../models/bannerModel");
const wishlistModel = require("../../models/wishlistModel");

const loadHome = async (req, res) => {
  try {
    const id = req.session.user_id;
    let search = "";
    if (req.query.search) {
      search = req.query.search;
    }

    const user = await userModel.findOne({ _id: id });
    const cart = await cartModel.findOne({ userId: id });
    const banners = await bannerModel.find();
    const wishlist = await wishlistModel.findOne({ userId: id });

    const products = await productModel.find({
      productName: { $regex: new RegExp(search, "i") },
    });

    const categories = await categoryModel.find();
    res.render("user/home", {
      categories,
      cart,
      products,
      user,
      id,
      banners,
      wishlist,
    });
  } catch (error) {
    res.render('user/404page');
  }
};

const userLogout = (req, res) => {
  try {
    req.session.user_id = null;
    res.redirect("/");
  } catch (error) {
    res.render('user/404page');
  }
};

module.exports = {
  loadHome,
  userLogout,
};
