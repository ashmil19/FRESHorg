require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;

const authRoutes = require('./routes/auth/authRoute');
const adminProductRoutes = require('./routes/admin/productRoutes');
const admincategoryRoutes = require('./routes/admin/categoryRoutes');
const adminUserRoutes = require('./routes/admin/userRoutes');


const fileUpload = require('express-fileupload');


const app = express();

// register view engine
app.set('view engine', 'ejs');
mongoose.set('strictQuery',false);

mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>{
        console.log("connected to mongoDB");
    })
    .catch((err)=>{
        console.log("Error connecting to mongoDB: ",err);
    })

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    limits: {fileSize: 50 * 2024 * 1024}
}));

// routes
app.use('/',authRoutes);
app.use('/admin/product',adminProductRoutes);
app.use('/admin/category',admincategoryRoutes);
app.use('/admin/user',adminUserRoutes);

// start the app
app.listen(process.env.PORT,()=>{
    console.log(`http://localhost:${process.env.PORT}`)
});