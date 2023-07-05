
const isLogin = (req, res, next)=>{
    try {
        if(req.session.user_id){
            next();
        }else{
            res.redirect('/login');
        }

    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = (req, res, next)=>{
    try {

        if(req.session.user_id){
            res.redirect('/');
        }else{
            next();
        }
        
    } catch (error) {
        console.log(error.message);
    }
}


module.exports ={
    isLogin,
    isLogout,
} 
    