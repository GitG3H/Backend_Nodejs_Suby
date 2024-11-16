//Imports
const express = require("express");   
const dotEnv = require('dotenv');
const mongoose = require("mongoose");
const vendorRoutes = require('./routes/vendorRoutes');
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');
const path = require('path');

const app = express();                //assign methods coming from express to app variable
const PORT = process.env.PORT || 4000;                     // assign specific port 

dotEnv.config();
app.use(cors());

//connect to db using mongoose.connect, promise(.then, .catch)
mongoose.connect(process.env.MONGO_URI) 
    .then(()=>console.log("MongoDB connected successfully!"))
    .catch((error)=>console.log(error))

//use bodyparser to parse input fields to json format.
app.use(bodyParser.json());
//to create http request, app.use() middleware is used.
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads', express.static('uploads')); //Standard middleware method

// to start server
app.listen (PORT,()=>{                  
    console.log(`Server started and running at ${PORT}`);
});

// define home route
app.use('/',(req,res)=>{
    res.send("<h1> Welcome to SUBY");
})        
