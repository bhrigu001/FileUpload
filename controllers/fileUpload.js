const File = require("../models/File");
const cloudinary = require("cloudinary").v2;
const MAX_FILE_SIZE_MB = 5;

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


function isFileTypeSuported(type,supportedTypes){
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file,folder,quality){
    const options = {folder};
    console.log("temp file path",file.tempFilePath);

    if(quality){
        options.quality = quality;
    }

    options.resource_type="auto"; //to automaticallt detect video type
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}


//image upload handler

 exports.imageUpload = async (req,res)=>{
    try{
        //data fetch
        const {name,tags,email} =req.body;
        console.log(name,tags,email);

        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes = ["jpg","jpeg","png"];
        const fileType =file.name.split(".")[1].toLowerCase();
  
        if(!isFileTypeSuported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:'File format not supported',
            })
        }

        //file format supported
        const response = await uploadFileToCloudinary(file,"Career Crafter");
        console.log(response);

        //saving entry in db
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        });

        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:'Image Uploaded Successfully',
        })


    }catch(err){
      console.error(err);
      res.status(400).json({
        success:false,
        message:'Something went wrong',
      });
    }

}

//video upload handler

exports.videoUpload = async (req,res)=>{
    try{
        //data fetch
        const {name, email ,tags} = req.body;
        console.log(name,email,tags);

        const file = req.files.vidoFile;

         //validation
         const supportedTypes = ["mp4","mov"];
         const fileType =file.name.split(".")[1].toLowerCase();
     
         // Validation: Check file size (in megabytes)
           const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to megabytes
           if (fileSizeInMB > MAX_FILE_SIZE_MB) {
         return res.status(400).json({
             success: false,
             message: `File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB} MB`,
         });
     }

         if(!isFileTypeSuported(fileType,supportedTypes)){
             return res.status(400).json({
                 success:false,
                 message:'File format not supported',
             })
         }
       //file format supported hai
        console.log("Uploading to Carrer Crafter");
        const response = await uploadFileToCloudinary(file, "Career Crafter");
        console.log(response);
      //saving entry in db
         const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        });

        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:'Video Successfully Uploaded',
        })


    }catch(err){
        console.error(err);
        res.status(400).json({
            success:false,
            message:'Something went wrong',
        })
    }
}

//imageSizeReducer

exports.imageSizeReducer= async (req,res)=>{
   try{
            //data fetch
            const {name,tags,email} =req.body;
            console.log(name,tags,email);
    
            const file = req.files.imageFile;
            console.log(file);
    
            //validation
            const supportedTypes = ["jpg","jpeg","png"];
            const fileType =file.name.split(".")[1].toLowerCase();
      
            if(!isFileTypeSuported(fileType,supportedTypes)){
                return res.status(400).json({
                    success:false,
                    message:'File format not supported',
                })
            }
    
            //file format supported
            const response = await uploadFileToCloudinary(file,"Career Crafter",30);
            console.log(response);
    
            //saving entry in db
            const fileData = await File.create({
                name,
                tags,
                email,
                imageUrl:response.secure_url,
            });
    
            res.json({
                success:true,
                imageUrl:response.secure_url,
                message:'Image Uploaded Successfully',
            })

   }
   catch(err){
         console.error(err);
        res.status(400).json({
            success:false,
            message:'Something went wrong',
        })
   }
}








