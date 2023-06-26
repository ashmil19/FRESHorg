const cloudinary = require('cloudinary').v2;


const imageUpload = async (file)=>{
    try{

        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            public_id: `${Date.now()}`,
            resource_type: "auto",
            folder: "imagesfortesh",
        })
        
        return result.url;

    }catch(err){
        console.log(err);
    }
}



const multipleImage = async (files)=>{

    try{
    
        let imageUrlList = [];
        
        for(let i=0;i<files.length;i++){
            const file = files[i];
            const result = await imageUpload(file);
            imageUrlList.push(result);
        }
        
        return imageUrlList;

    }catch(err){
        console.log(err);
    }
}



module.exports = multipleImage;