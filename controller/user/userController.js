

const loadHome = (req, res)=>{
    if(req.session.admin_id){
        res.redirect('/admin/dashboard');
    }else{
        res.redirect('/login');
    }
}

module.exports = {
    loadHome,
}