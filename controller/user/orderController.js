const orderItemModel = require("../../models/orderItemModel");
const orderModel = require("../../models/orderModel");
const userModel = require("../../models/userModel");

const loadorder = async (req, res)=>{
    const userId = req.session.user_id;
    const userData = await userModel.findOne({_id: userId});
    const orders = await orderModel.findOne({user: userId});

    let products = [];
    for(const item of orders.items){
        const product = await orderItemModel.findOne({_id: item}).populate("product")
        products.push(product)
    }
    
    res.render('user/order',{id: userId,products, orders, user: userData});
}

const removeOrder = (req, res)=>{
    
}

module.exports = {
    loadorder,
}