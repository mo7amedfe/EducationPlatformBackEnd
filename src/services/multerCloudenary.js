import multer from "multer"
import { allowedExtensions } from "../utils/allowedExtentions.js"


export const multercloudFunction  = (allowedExtensionsArr)=>{
    if(!allowedExtensionsArr){
        allowedExtensionsArr=allowedExtensions.Image
    }
    const storage  = multer.diskStorage({})
    const fileFilter = function(req,file,cb){
        if(allowedExtensionsArr.includes(file.mimetype)){
           return cb(null,true)
        }
        cb(new Error('invalid extention',{cause:400}),false )
    }
    const fileUpload = multer({
        fileFilter,
        storage,
        limits:{
            feilds:2,
            files:2
        }
    })
    return fileUpload
}