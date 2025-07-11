// import multer from "multer"
// import { customAlphabet } from "nanoid"
// import path from 'path'

// const nanoid = customAlphabet('1234_=qwer',5)
// const allowedExtensions = {
//     Image:['image/png','image/jpeg','image/gif'],
//     Files:['application/pdf','application/javascript'],
//     Videos:['video/mp4']
// }
// export const multerFunction  = (allowedExtensionsArr,customPath)=>{
//     if(!allowedExtensionsArr){
//         allowedExtensionsArr=allowedExtensions.Image
//     }
//     const storage  = multer.diskStorage({
//         destination:function(req,file,cb){
//             const destpath = path.resolve(`upolads/${customPath}`)
//             cb(null,destpath)
//         },
//         filename:function(req,file,cb){
            
//             const unifilename = nanoid() + file.originalname
//             cb(null,unifilename)
//         }
//     })
//     const fileFilter = function(req,file,cb){
//         if(allowedExtensionsArr.includes(file.mimetype)){
//            return cb(null,true)
//         }
//         cb(new Error('invalid extention',{cause:400}),false )
//     }
//     const fileUpload = multer({
//         fileFilter,
//         storage,
//         limits:{
//             feilds:2,
//             files:2
//         }
//     })
//     return fileUpload
// }