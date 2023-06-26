const userModel = require('../../models/userModel');

const loadUser = async (req, res)=>{
    const userData = await userModel.find();
    res.render('admin/users',{users: userData});
}

const loadEditUser = async (req, res)=>{
    const id = req.query.id
    const user = await userModel.findOne({_id: id});
    res.render('admin/editUser',{user});
}

const editUser = async (req, res)=>{
    const id = req.query.id
    const isAccess = req.body.access
    
    await userModel.findByIdAndUpdate(id, {isAccess});
    res.redirect('/admin/user');
}


module.exports = {
    loadUser,
    loadEditUser,
    editUser,
}