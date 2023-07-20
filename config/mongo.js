require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery',false);

const connectMongo = (req, res)=>{
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
}


module.exports = connectMongo;