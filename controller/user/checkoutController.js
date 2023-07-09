const addressModel = require("../../models/addressModel");
const userModel = require("../../models/userModel");


const loadCheckoutAddress = async (req, res)=>{
    const id = req.session.user_id;

    const userData = await userModel.findOne({_id: id});
    const address = await addressModel.find({_id: id});
    const contactAddress = await addressModel.findOne({user: id,type: "contact"});
    const mainAddress = await addressModel.findOne({user: id,type: "main"});
    const secondaryAddress = await addressModel.find({user: id,type: "secondary"});

    // console.log(contactAddress);
    // console.log(mainAddress);
    // console.log(secondaryAddress);
    console.log(address);

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



module.exports = {
    loadCheckoutAddress,
    checkoutAddAddress
}