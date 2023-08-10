const userModel = require('../../models/userModel');

const loadUser = async (req, res)=>{
    try {
        const userData = await userModel.find();
        res.render('admin/users',{users: userData});
    } catch (error) {
        console.log(error);
    }
}

const loadEditUser = async (req, res)=>{
    try {
        const id = req.query.id
        const user = await userModel.findOne({_id: id});
        res.render('admin/editUser',{user});
    } catch (error) {
        console.log(error);
    }
}

const editUser = async (req, res)=>{
    try {
        const id = req.query.id
        const isAccess = req.body.access
        await userModel.findByIdAndUpdate(id, {isAccess});
        res.redirect('/admin/user');
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    loadUser,
    loadEditUser,
    editUser,
}