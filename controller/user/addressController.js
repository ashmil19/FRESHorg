const userModel = require("../../models/userModel");
const addressModel = require("../../models/addressModel");
const cartModel = require("../../models/cartModel");
const wishlistModel = require("../../models/wishlistModel");

const loadAddress = async (req, res) => {
  try {
    const id = req.session.user_id;
    const userData = await userModel.findOne({ _id: id });
    const contactAddress = await addressModel.findOne({
      user: id,
      type: "contact",
    });
    const mainAddress = await addressModel.findOne({ user: id, type: "main" });
    const secondaryAddress = await addressModel.find({
      user: id,
      type: "secondary",
    });
    const cart = await cartModel.findOne({ userId: id });
    const wishlist = await wishlistModel.findOne({ userId: id });

    res.render("user/address", {
      id,
      user: userData,
      contact: contactAddress,
      main: mainAddress,
      secondary: secondaryAddress,
      cart,
      wishlist,
    });
  } catch (error) {
    res.render("user/404page");
  }
};

const loadAddAddress = async (req, res) => {
  try {
    const id = req.session.user_id;
    const user = await userModel.findOne({ _id: id });
    const wishlist = await wishlistModel.findOne({ user: id });
    const cart = await cartModel.findOne({ user: id });
    const type = req.query.type;
    res.render("user/addAddress", { type, id, wishlist, cart, user });
  } catch (error) {
    res.render("user/404page");
  }
};

const addAddress = async (req, res) => {
  try {
    const id = req.session.user_id;

    const { buildingName, street, city, state, country, type } = req.body;

    let pincode = parseInt(req.body.pincode);
    let phonenumber = parseInt(req.body.number);

    const newAddress = new addressModel({
      buildingName,
      street,
      city,
      state,
      pincode,
      country,
      phonenumber,
      user: id,
      type,
    });

    await newAddress.save();
    res.redirect("/address");
  } catch (error) {
    res.render("user/404page");
  }
};

const loadEditAddress = async (req, res) => {
  try {
    const { type, id } = req.query;
    const userId = req.session.user_id;
    const user = await userModel.findOne({ _id: userId });
    const wishlist = await wishlistModel.findOne({ user: userId });
    const cart = await cartModel.findOne({ user: userId });
    const address = await addressModel.findOne({ _id: id });
    res.render("user/editAddress", {
      type,
      address,
      id: userId,
      wishlist,
      cart,
      user,
    });
  } catch (error) {
    res.render("user/404page");
  }
};

const editAddress = async (req, res) => {
  try {
    const addressId = req.query.addressId;
    const { buildingName, street, city, state, country } = req.body;

    let pincode = parseInt(req.body.pincode);
    let phonenumber = parseInt(req.body.number);

    await addressModel.findByIdAndUpdate(addressId, {
      buildingName,
      street,
      city,
      state,
      pincode,
      country,
      phonenumber,
    });

    res.redirect("/address");
  } catch (error) {
    res.render("user/404page");
  }
};

const deleteAddress = async (req, res) => {
  try {
    const id = req.query.id;
    await addressModel.deleteOne({ _id: id });
    res.json({ response: true });
  } catch (error) {
    res.render("user/404page");
  }
};

module.exports = {
  loadAddress,
  loadAddAddress,
  addAddress,
  loadEditAddress,
  editAddress,
  deleteAddress,
};
