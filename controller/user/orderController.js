const orderItemModel = require("../../models/orderItemModel");
const orderModel = require("../../models/orderModel");
const productModel = require("../../models/productModel");
const userModel = require("../../models/userModel");

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


module.exports = {
    loadorder,
    loadOrderDetails,
    removeOrder,

}