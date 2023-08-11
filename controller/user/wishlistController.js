const cartModel = require("../../models/cartModel");
const productModel = require("../../models/productModel");
const userModel = require("../../models/userModel");
const wishlistModel = require("../../models/wishlistModel");

const loadWishlist = async (req, res) => {
  try {
    const id = req.session.user_id;
    const user = await userModel.findOne({ _id: id });
    const wishlist = await wishlistModel
      .findOne({ userId: id })
      .populate("items");
    const cart = await cartModel.findOne({ userId: id });
    res.render("user/wishlist", { id, user, wishlist, cart });
  } catch (error) {
    res.render('user/404page');
  }
};

const addToWishlist = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const { productId } = req.query;
    const product = await productModel.findOne({ _id: productId });
    const wishlist = await wishlistModel.findOne({ userId: userId });

    if (!wishlist) {
      const newWishlist = wishlistModel({
        userId: userId,
        items: [product._id],
      });

      newWishlist.save();
      res.send({ response: true });
    } else {
      const alreadyExist = await wishlistModel.findOne({
        userId,
        items: product._id,
      });

      if (alreadyExist) {
        await wishlistModel.updateOne(
          { userId },
          {
            $pull: { items: productId },
          }
        );

        res.send({ response: false });
        return;
      }

      await wishlistModel.updateOne(
        { userId },
        {
          $push: { items: productId },
        }
      );

      res.send({ response: true });
      return;
    }
  } catch (error) {
    res.render('user/404page');
  }
};

module.exports = {
  loadWishlist,
  addToWishlist,
};
