const bcrypt = require('bcrypt');

const userModel = require('../../models/userModel');
const cartModel = require('../../models/cartModel');
const wishlistModel = require('../../models/wishlistModel');
const hash = require('../../utils/toHash');


const loadProfile = async (req, res)=>{
    try {
        const id = req.session.user_id;
        const userData = await userModel.findOne({_id: id});
        const cart = await cartModel.findOne({userId: id});
        const wishlist = await wishlistModel.findOne({userId: id});
        res.render("user/profile",{id, user: userData, cart, wishlist});
    } catch (error) {
        console.log(error);
    }
}

const loadEditUser = async (req, res)=>{
    try {
        const id = req.query.id;
        const user = await userModel.findOne({_id: id});
        res.render("user/editUser", {user});
    } catch (error) {
        console.log(error);
    }
}

const editUser = async (req, res)=>{
    try {
        const id = req.query.id;
        const username = req.body.username;
        const user = await userModel.findByIdAndUpdate(id,{$set: {username: username}});;
        console.log(user);
        res.redirect('/profile');
    } catch (error) {
        console.log(error);
    }
}

const loadOldPassword = (req, res)=>{
    try {
        const id = req.session.user_id;
        res.render('user/oldPassword',{id,message: null});
    } catch (error) {
        console.log(error);
    }
}

const verifyOldPassword = async (req, res)=>{
    try {
        const id = req.query.id;
        const oldPassword = req.body.oldPassword
        const userData = await userModel.findOne({_id: id});
        const passMatch = await bcrypt.compare(oldPassword, userData.password);

        if(!passMatch){
            res.render('user/oldPassword',{id, message: "The old password is incorrect"});
        }else{
            res.render('auth/newPassword',{action: "/profile/newPassword"})
        }

    } catch (error) {
        console.log(error);    
    }
    
}

const profileNewPassword = async (req, res)=>{
    try {
        const id = req.session.user_id;
        const newPassword = req.body.password;
        const hashNewPassword = await hash(newPassword);
        await userModel.findByIdAndUpdate(id, {password: hashNewPassword});
        res.redirect('/profile');
    } catch (error) {
        console.log(error);
    }
}




module.exports = {
    loadProfile,
    loadEditUser,
    editUser,
    loadOldPassword,
    verifyOldPassword,
    profileNewPassword,
}