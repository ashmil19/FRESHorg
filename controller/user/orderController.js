const orderItemModel = require("../../models/orderItemModel");
const orderModel = require("../../models/orderModel");
const productModel = require("../../models/productModel");
const userModel = require("../../models/userModel");

const loadorder = async (req, res)=>{
    const userId = req.session.user_id;
    const userData = await userModel.findOne({_id: userId});
    const orders = await orderModel.findOne({user: userId});

    let products = [];
    if(orders){

        for(const item of orders.items){
            const product = await orderItemModel.findOne({_id: item}).populate("product")
            products.push(product)
        }
    }
    
    res.render('user/order',{id: userId,products, orders, user: userData});
}

const removeOrder = async (req, res)=>{
    const {
        orderItemId,
        orderId
    } = req.body;

    console.log(orderItemId);
    console.log(orderId);

    await orderModel.findOneAndUpdate({_id: orderId},
        {
            $pull: {items: orderItemId}
        })

    const cartProduct = await orderItemModel.findOne({_id: orderItemId});

    
    await productModel.findOneAndUpdate({_id: cartProduct.product},
        {
            $inc: {quantity: cartProduct.quantity}
        })

    await orderItemModel.deleteOne({_id: orderItemId})

    res.json({response: true});

}

module.exports = {
    loadorder,
    removeOrder,
}