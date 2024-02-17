const file = require("../models/File");


//local file Upload handler
exports.localFileUpload = async (req,res)=>{
    try{
         
        //fetch file from request
        const file = req.files.file;
        console.log("Our files->",file);
        
        //Create path where file needs to be stored on server
        let path = __dirname + "/files/" +Date.now() +`. ${file.name.split('.')[1]}` ;
        console.log("Path->",path);
        
        //add path to the move function
        file.mv(path,(err)=>{
            console.log("Error in moving file->",err);
        });

        //Create a success response
        res.json({
            success:true,
            message:'Local file Uploaded Successfully',
        });
    }
    catch(error){
     console.log("Not able to upload file on server");   
     console.log(error);
    }
}