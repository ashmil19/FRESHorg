const addressModel = require("../../models/addressModel");
const orderItemModel = require("../../models/orderItemModel");
const orderModel = require("../../models/orderModel");
const productModel = require("../../models/productModel");
const userModel = require("../../models/userModel");
const couponModel = require('../../models/couponModel');

const loadorder = async (req, res)=>{
    const userId = req.session.user_id;
    const userData = await userModel.findOne({_id: userId});
    const orders = await orderModel.find({user: userId});

    // let products = [];
    // if(orders){

    //     for(const order of orders){
    //         const product = await orderItemModel.findOne({user}).populate("product")
    //         products.push(product)
    //     }
    // }

    const products = await orderModel.find({user: userId})
                            .populate({
                                path: 'items',
                                model: 'orderItem',
                                populate: {
                                    path: 'product',
                                    model: 'product'
                                }
                            })

    
    res.render('user/order',{id: userId, products, orders, user: userData});
}

const loadOrderDetails = async (req, res)=>{
    try {

        const userId = req.session.user_id; 
        const { orderId } = req.query;

        const user = await userModel.findOne({_id: userId});

        const order = await orderModel.findOne({_id: orderId})
                                .populate({
                                    path: 'items',
                                    model: 'orderItem',
                                    populate: {
                                        path: 'product',
                                        model: 'product'
                                    }
                                }) 
        
        const cartAddress = await orderModel.findOne({_id: orderId}).populate("address");

        res.render('user/orderDetails',{id: userId, user, order, address: cartAddress.address});
        
    } catch (error) {
        console.log(error);
    }
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

const loadOrderSuccessPage = async (req, res)=>{
    
    const { orderId } = req.query;

    const order = await orderModel.findOne({_id: orderId});
    const user = await userModel.findOne({_id: order.user});
    const address = await addressModel.findOne({_id: order.address});
    
    const product = await orderModel.findOne({_id: orderId})
                                .populate({
                                    path: 'items',
                                    model: 'orderItem',
                                    populate: {
                                        path: 'product',
                                        model: 'product'
                                    }
                                }) 
    const coupon = await couponModel.findOne({_id: order.coupon})
    console.log(coupon);

    res.render('user/orderSuccess',{user, order, address, product, coupon});
}


module.exports = {
    loadorder,
    loadOrderDetails,
    removeOrder,
    loadOrderSuccessPage,
}