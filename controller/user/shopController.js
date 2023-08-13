const bannerModel = require("../../models/bannerModel");
const cartModel = require("../../models/cartModel");
const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");
const userModel = require("../../models/userModel");
const wishlistModel = require("../../models/wishlistModel");

const loadShop = async (req, res) => {
  try {
    const id = req.session.user_id;
    const ITEMS_PER_PAGE = 6;
    const page = +req.query.page || 1;
    let search = "";
    if (req.query.search) {
      search = req.query.search;
    }

    let minamount = 0;
    let maxamount = 200;

    if (req.query.minamount || req.query.maxamount) {
      minamount = parseInt(req.query.minamount);
      maxamount = parseInt(req.query.maxamount);
    }

    const user = await userModel.findOne({ _id: id });
    const cart = await cartModel.findOne({ userId: id });
    const banners = await bannerModel.find();
    const wishlist = await wishlistModel.findOne({ userId: id });

    const query = {
      isActive: true,
      productName: { $regex: new RegExp(search, "i") },
      $and: [{ price: { $gt: minamount } }, { price: { $lt: maxamount } }],
    };

    const totalProducts = await productModel.countDocuments(query);
    const products = await productModel
      .find(query)
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    const categories = await categoryModel.find();

    res.render("user/shop", {
      products,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
      lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
      categories,
      cart,
      user,
      id,
      banners,
      search,
      minamount,
      maxamount,
      wishlist,
    });
  } catch (error) {
    res.render('user/404page');
  }
};

module.exports = {
  loadShop,
};
