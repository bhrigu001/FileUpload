//Creating App
const express = require('express');
const app = express();

//Finding Port
require("dotenv").config();
const PORT = process.env.PORT || 4000;

//Importing middleware
app.use(express.json());
const fileUpload = require("express-fileupload");  //middleware to upload files on server
app.use(fileUpload());

//Connection with db
const db=require("./config/database");
db.connect();

//connecting with cloud
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();  
 
//mounting api route
const Upload = require("./routes/FileUpload");
app.use('/api/v1/upload',Upload);

//activating server
app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`);
})
