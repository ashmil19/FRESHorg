

const loadDashboard = (req, res)=>{
    res.render('admin/dashboard');
}

const adminLogout = (req, res)=>{
    try {

        req.session.admin_id = null
        res.redirect('/login');
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loadDashboard,
    adminLogout,
}