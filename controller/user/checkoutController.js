const addressModel = require("../../models/addressModel");
const userModel = require("../../models/userModel");
const cartModel = require("../../models/cartModel");
const orderModel = require("../../models/orderModel");
const orderItemModel = require("../../models/orderItemModel");
const productModel = require("../../models/productModel");

const loadCheckoutAddress = async (req, res)=>{
    const id = req.session.user_id;

    const userData = await userModel.findOne({_id: id});
    const address = await addressModel.find({_id: id});
    const contactAddress = await addressModel.findOne({user: id,type: "contact"});
    const mainAddress = await addressModel.findOne({user: id,type: "main"});
    const secondaryAddress = await addressModel.find({user: id,type: "secondary"});

    res.render('user/checkoutAddress',{id, user: userData, contact: contactAddress, main: mainAddress, secondary: secondaryAddress, address});
}


const checkoutAddAddress = async (req, res)=>{

    try {

        const user_id = req.session.user_id;

        const { 
            building,
            street,
            city,
            state,
            country,
            type
        } = req.body;

        const pincode = Number(req.body.pincode);
        const phonenumber = Number(req.body.phone);

        const newAddress = new addressModel({
            buildingName: building,
            street,
            city,
            state,
            pincode,
            country,
            phonenumber,
            user: user_id,
            type,
        })

        await newAddress.save();
        res.redirect('/checkout/address');

        
    } catch (error) {
        console.log(error);
    }
    
}

const selectAddress = async (req, res)=>{
    const {addressId ,userId} = req.query;
    if(userId){
        const cart = await cartModel.findOne({userId});
        let productList = [];
        const product = await cartModel
                                .findOne({userId: userId})
                                .populate("items.productId");

        product.items.forEach((item)=>{
            productList.push(item.productId)
        })

        res.render('user/checkout',{cart, productList, addressId});

    }else{

        res.redirect('/');

    }
    
    
}

const checkout = async (req, res)=>{
    const userId = req.session.user_id;

    const {
        payment,
        address,
    } = req.body;

    const cart = await cartModel.findOne({userId: userId});

    const orderItemIdList = Promise.all(cart.items.map(async (item)=>{
        const newItem = new orderItemModel({
            product: item.productId,
            quantity: item.quantity,
        })

        const newOrderItem = await newItem.save();
        return newOrderItem._id;
    }))

    const items = await orderItemIdList;

    
    const newOrder = orderModel({
        user: userId,
        address: address,
        items: items,
        price: cart.cartPrice,
        payment_status: false,
        payment_method: payment,
    })

    await newOrder.save()

    cart.items.forEach( async (item)=>{
        const product = await productModel.findOne({_id: item.productId});
        await productModel.updateMany({_id: item.productId},
            {$set: {quantity: product.quantity - item.quantity}})
    })

    cart.items.forEach(async (item)=>{
        const product = await productModel.findOne({_id: item.productId});
        await cartModel.updateMany(
          {
            "items.productId": item.productId,
            "items.quantity": { $gt: product.quantity },
          },
          { $set: { "items.$.quantity": product.quantity } }
        );

        
    })

    await cartModel.deleteOne({userId: userId});

    res.redirect('/');

}



module.exports = {
    loadCheckoutAddress,
    checkoutAddAddress,
    selectAddress,
    checkout,
}