const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');

const userModel = require('../../models/userModel');


const hashPassword = async (password)=>{
    try{
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    }
    catch(err){
        console.log(err.message);
    }
}

const sendEmail = async (savedUser)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    })

    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: savedUser.email, // list of receivers
        subject: "Verify Your Email", // Subject line
        text: "please click", // plain text body
        html: `<p>To verify your <b>Freshorg</b> account <a href="http://localhost:${process.env.PORT}/signup/success/?id=${savedUser._id}">click here<a></p>`, // html body
    });

    console.log("message sent: ",info.messageId);
}

const emailVerifySuccess = async (req, res) =>{

    try{
        userId = req.query.id;
        await userModel.findByIdAndUpdate(req.query.id, {$set: {isVerified: true}});
        res.redirect('/login')

    }catch(err){
        console.log(err);
    }
    
}

const loadSignUp = (req, res)=>{
    res.render('auth/signup',{message: null});
}

const createUser = async (req, res)=>{
    try{

        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        
        const userData = await userModel.findOne({email: email});

        if(userData){
            res.render('auth/signup',{message: "This email has another account"})
        }else{
            const passwordHash = await hashPassword(password);
            const newUser = userModel({
                username: username,
                email: email,
                password: passwordHash,
            })

            const savedUser = await newUser.save();
            await sendEmail(savedUser);
            res.render('auth/verifyEmail');
        }

    }catch(err){
         console.log(err);
    }
}

const otpGenerate = ()=>{
    const secret = speakeasy.generateSecret({ length: 20 });

    const code = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32',
        digits: 4,
    })

    return {code ,secret};
}

const sendOtp = async (user)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    })

    const otp = otpGenerate();

    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: user.email, // list of receivers
        subject: "OTP verification", // Subject line
        text: "Don't share the code", // plain text body
        html: `<p>Your OTP is <b>${otp.code}</b></p>`, // html body
    });

    
    return otp.secret;
}

const otpVerify = (req, res)=>{
    const token = req.body.otp;
    const secret = req.cookies['otpHash']
    
    const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        digits: 4,
    })
    
    console.log(verified);

    if(verified){
        res.send("success");
    }else{
        res.send('failer');
    }

    
}

const loadLogin = (req,res)=>{
    res.render('auth/login',{message: null});
}

const verifyLogin = async (req, res)=>{

    try{

        const email = req.body.email;
        const password = req.body.password;
        
        const userData = await userModel.findOne({email: email});

        if(userData){
            const passMatch = await bcrypt.compare(password, userData.password);

            if(passMatch){

                if(userData.isAdmin){
                    req.session.admin_id = userData._id;
                    res.redirect('/admin/dashboard');
                }else{

                    
                    if(userData.isVerified && userData.isAccess){
                        
                        const secret = await sendOtp(userData);
                        
                        const options = {
                            maxAge: 1000 * 60 * 2,
                            httpOnly: true,
                        }
                        
                        res.cookie('otpHash', secret.base32, options);
                        res.render('auth/otp');
                        
                    }else{
                        // you dont have the access
                        res.render('auth/login',{message: "You don't have the access"});
                    }
                }
            }else{
                // password is incorrect
                res.render('auth/login',{message: "Password is incorrect"});
            }
        }else{
            // user not found
            res.render('auth/login',{message: "User not found"});
        }

    }catch(err){
        console.log(err);
    }



}



module.exports = {
    loadSignUp,
    loadLogin,
    createUser,
    emailVerifySuccess,
    verifyLogin,
    otpVerify
}