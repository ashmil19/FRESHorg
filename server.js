require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nocache = require('nocache');
const fileUpload = require('express-fileupload');


const mongodb = require('./config/mongo');
const cloudinaryConnect = require('./config/cloudinary');
const userRoutes = require('./routes/userRoute');
const adminRoutes = require('./routes/adminRoutes');


const app = express();

// register view engine
app.set('view engine', 'ejs');

//connecting mongoose
mongodb();

//connecting cloudinary
cloudinaryConnect();

// middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    limits: {fileSize: 50 * 2024 * 1024}
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {sameSite: 'strict'},
    saveUninitialized: true,
    resave: false
}));

app.use(nocache());


// routes
app.use('/admin',adminRoutes);
app.use('/',userRoutes);

// start the app
app.listen(process.env.PORT,()=>{
    console.log(`http://localhost:${process.env.PORT}`)
});