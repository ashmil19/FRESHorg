require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth/authRoute');
const adminProductRoutes = require('./routes/admin/productRoutes');
const admincategoryRoutes = require('./routes/admin/categoryRoutes');


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

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/',authRoutes);
app.use('/admin/product',adminProductRoutes);
app.use('/admin/category',admincategoryRoutes);

// start the app
app.listen(process.env.PORT,()=>{
    console.log(`http://localhost:${process.env.PORT}`)
});