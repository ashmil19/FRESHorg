const cartModel = require('../../models/cartModel');
const productModel = require('../../models/productModel')

const loadCart = async (req, res)=>{
    const cart = await cartModel.findOne({userId: req.session.user_id})
    const products = await productModel.find();
    res.render("user/cart",{cart, products});
}

// const addToCart1 = async (req , res)=>{
//     try {
        
//         const { productId } = req.query;
//         const productQuantity = parseInt(req.query.quantity)
//         const id = req.session.user_id;
//         const cart = await cartModel.findOne({userId: id});
//         const product = await productModel.findOne({_id: productId});
//         const newTotalPrice = productQuantity * product.price;
        
//         if(cart){

//             let productExist = await cartModel.findOne({userId: id, "items.productId": productId})

//             if(productExist){
                
//                 await cartModel.findOneAndUpdate({userId: id, "items.productId": productId},
//                     {
//                         $inc: {
//                             "items.$.quantity": productQuantity,
//                             "items.$.totalPrice": newTotalPrice, 
//                         }
//                     })
//             }else{
//                 await cartModel.findOneAndUpdate({userId: id},
//                     {
//                         $push: {
//                             items:[
//                                 {
//                                     productId,
//                                     quantity: productQuantity,
//                                     totalPrice: newTotalPrice
//                                 }
//                             ]
//                         }
//                     })
//             }

//         }else{
//             const newItem = new cartModel({
//                 userId: id,
//                 items: [
//                     {
//                         productId,
//                         quantity: productQuantity,
//                         totalPrice: newTotalPrice
//                     }
//                 ],
//                 cartPrice: newTotalPrice,
//             });

//             await newItem.save();

//         }

//         const cartTotalPrice = await cartModel.aggregate([
//             {
//                 $match: { userId: id }
//             },
//             {
//                 $unwind: "$items"
//             },
//             {
//                 $group: {
//                     _id: null,
//                     total: {$sum: "$items.totalPrice"}
//                 }
//             }
//         ]);

//         await cartModel.updateOne(
//             {userId: id},
//             {$set: {cartPrice: cartTotalPrice[0].total}}
//         )
        
//         res.redirect("/shop");

//     } catch (error) {
//         console.log(error);
//     }

// }


const addToCart = (req, res)=>{
    try {


        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loadCart,
    addToCart,
}