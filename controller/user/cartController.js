const ObjectId = require('mongoose').Types.ObjectId;
const cartModel = require('../../models/cartModel');
const productModel = require('../../models/productModel')

const loadCart = async (req, res)=>{
    const cart = await cartModel.findOne({userId: req.session.user_id})
    let productList = [];
    const product = await cartModel
                            .findOne({userId: req.session.user_id})
                            .populate("items.productId");

    product.items.forEach((item)=>{
        productList.push(item.productId)
    })
    
    res.render("user/cart",{cart, productList});
}




const addToCart = async (req, res)=>{
    try {

        const { productId } = req.query;
        const userId = req.session.user_id;
        
        
        
        const cart = await cartModel.findOne({userId: userId});
        const product = await productModel.findOne({_id: productId});
    
        if(cart){

            let productExist = await cartModel.findOne({userId: userId, "items.productId": productId});

            if(productExist){
                await cartModel.findOneAndUpdate({userId: userId, "items.productId": productId},
                {
                    $inc: {
                        "items.$.quantity": 1,
                        "items.$.totalPrice": product.price,
                    }
                })
            }else{
                await cartModel.findOneAndUpdate({userId: userId},
                    {
                        $push: {
                            items: [
                                {
                                    productId,
                                    totalPrice: product.price,
                                }
                            ]
                        }
                    })
            }

        }else{
            const newItem = new cartModel({
                userId: userId,
                items: [
                    {
                        productId,
                        totalPrice: product.price
                    }
                ]
            })
            await newItem.save();
        }

        const cartTotalPrice = await cartModel.aggregate([
            {
                $match: {userId: new ObjectId(userId)}
            },
            {
                $unwind: "$items"
            },
            {
                  $group: {
                    _id: null,
                    total: {$sum: "$items.totalPrice"}
                  } 
            }
            
        ])


        await cartModel.updateOne(
            {userId: userId},
            {$set: {cartPrice: cartTotalPrice[0].total }}
        )

        res.json({response: true});

        
    } catch (error) {
        console.log(error);
    }
}

const quantityDecrement = async (req, res)=>{
    try {

        const {userId , productId} = req.query;

        const product = await productModel.findOne({_id: productId});

        await cartModel.findOneAndUpdate({userId: userId, "items.productId": productId},
            {
                $inc: {
                    "items.$.quantity": -1,
                    "items.$.totalPrice": -product.price,
                    cartPrice: -product.price,
                }
            })

        res.json({response: true})
        
    } catch (error) {

        console.log(error);
        
    }
    
}

const quantityIncrement = async (req, res)=>{
    try {

        const {userId , productId} = req.query;

        const product = await productModel.findOne({_id: productId});

        await cartModel.findOneAndUpdate({userId: userId, "items.productId": productId},
            {
                $inc: {
                    "items.$.quantity": 1,
                    "items.$.totalPrice": product.price,
                    cartPrice: product.price,
                }
            })

        res.json({response: true})
        
    } catch (error) {

        console.log(error);
        
    }
    
}

const removeItem = async (req, res)=>{
    try {

        const {
            productId,
            userId,
        } = req.query;
    
        console.log(productId);
        console.log(userId);
    
        await cartModel.findOneAndUpdate({userId: userId, "items.productId": productId},
            {
                $pull: {
                    "items": {productId: productId}
                }
            })
    
        res.json({response: true})
        
    } catch (error) {
        console.log(error);
    }
    
}

module.exports = {
    loadCart,
    addToCart,
    quantityDecrement,
    quantityIncrement,
    removeItem,
}