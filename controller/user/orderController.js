const addressModel = require("../../models/addressModel");
const orderItemModel = require("../../models/orderItemModel");
const orderModel = require("../../models/orderModel");
const productModel = require("../../models/productModel");
const userModel = require("../../models/userModel");
const couponModel = require('../../models/couponModel');

const loadorder = async (req, res)=>{
    const userId = req.session.user_id;
    const userData = await userModel.findOne({_id: userId});
    const orders = await orderModel.find({user: userId}).sort({order_date: -1});

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
                            });

    
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
        
        const coupon  = await couponModel.findOne({_id: order.coupon});
        const cartAddress = await orderModel.findOne({_id: orderId}).populate("address");

        res.render('user/orderDetails',{id: userId, user, order, coupon, address: cartAddress.address});
        
    } catch (error) {
        console.log(error);
    }
}

const cancelOrder = async (req, res)=>{

    try {

        const {
            orderId
        } = req.body;

        const order = await orderModel.findOne({_id: orderId})
                                    .populate('items');
    
    
        await orderModel.findByIdAndUpdate(orderId,{order_status: "cancelled"})
        
        for(const item of order.items){
            
            await productModel.updateOne({_id: item.product },
                {
                    $inc: {quantity: item.quantity}
                })
    
        }

        res.send({response: true});
        
    } catch (error) {

        console.log(error);
        
    }
    




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
    cancelOrder,
    loadOrderSuccessPage,
}