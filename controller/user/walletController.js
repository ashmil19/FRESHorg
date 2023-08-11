const cartModel = require("../../models/cartModel");
const userModel = require("../../models/userModel");
const walletModel = require("../../models/walletModel");
const wishlistModel = require("../../models/wishlistModel");

const loadWallet = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const user = await userModel.findById(userId);
    const wallet = await walletModel.findOne({ user: userId });
    const cart = await cartModel.findOne({ userId: userId });
    const wishlist = await wishlistModel.findOne({ userId });
    res.render("user/wallet", { id: userId, user, wallet, cart, wishlist });
  } catch (error) {
    res.render('user/404page');
  }
};

module.exports = {
  loadWallet,
};
