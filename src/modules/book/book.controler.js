import { bookModel } from "../../../connections/models/book.model.js";
import { userModel } from "../../../connections/models/user.model.js";
import cloudinary from "../../utils/cloudinaryConfigration.js";
import { asyncHandler } from "../../utils/errorHandeling.js";

export const uploudBook = asyncHandler(async (req, res, next) => {
    const {_id}=req.authuser
    const {title,desc,email}=req.body
     const userExist = await userModel.findOne({ email })
    
      if(!userExist){
        return res.status(400).json({ message: 'email is not exist' })
      }
      
      if (userExist._id.toString() !== _id.toString()) {
        return res.status(401).json({ message: 'Unauthorized to take this action' })
      }
    //   if(!req.file){ 
    //     return next(new Error("no file uploaded",{cause:400}))
    //   }
    if(!title){
        return next(new Error("title is required",{cause:400}))
    }
    if(!desc){
        return next(new Error("desc is required",{cause:400}))
    }
    // const {secure_url,public_id}  = cloudinary.uploader.upload(req.file.path,{
    //     folder:`book/pdf/${_id}`,
    //     // public_id:`${_id}`
    //     use_filename:true,
    //     unique_filename:false, 
    //     resource_type:'auto'
    //   })
    // const pdfPath = req.files['pdf'][0].path;
    // const imagePath = req.files['image'][0].path;

    // // Upload PDF to Cloudinary
    // const {resource_url} = await cloudinary.uploader.upload(pdfPath, {
    //   resource_type: 'raw',
    //   folder: 'books',
    // });

    // // Upload Image to Cloudinary
    // const {secure_url,public_id} = await cloudinary.uploader.upload(imagePath, {
    //   resource_type: 'image',
    //   folder: 'book_covers',
    // });
    const bookInstance = new bookModel({
        title,desc
      })
      await bookInstance.save()
      res.status(201).json({ message: 'Done', bookInstance })
})
// ///////////////////////////////////////////////////////////////////////////////////////////////////////
// export const uploadbookPic = asyncHandler(async(req,res,next)=>{
//     const {_id}=req.authuser

      
//     //   if (userExist._id.toString() !== _id.toString()) {
//     //     return res.status(401).json({ message: 'Unauthorized to take this action' })
//     //   }
//   if(!req.file){ 
//     return next(new Error("no file uploaded",{cause:400}))
//   }
//   const {secure_url,public_id}  = cloudinary.uploader.upload(req.file.path,{
//     folder:`book/photo/${_id}`,
//     // public_id:`${_id}`
//     use_filename:true,
//     unique_filename:false, 
//     resource_type:'auto'
//   })
//   // if(!data){
//   //   return next(new Error("no data",{cause:400}))
//   // } 
//   const user = await bookModel.findByIdAndUpdate(_id,{profile_pic:{secure_url,public_id}},{new:true})
//   if(!user){
//     await cloudinary.uploader.destroy(public_id)//only one
//     // await cloudinary.api.delete_all_resources([publicids])// delete bulk of publicids
//   }
//   res.status(200).json({message:'done',user})
// })
export const uploadbookPic = asyncHandler(async(req,res,next)=>{
    const {_id}=req.params//of book
    if(!req.file){ 
        return next(new Error("no pic file uploaded",{cause:400}))
        }
     const {secure_url,public_id}  = await cloudinary.uploader.upload(req.file.path,{
        folder:`book/cover/${_id}`,
        // public_id:`${_id}`
        use_filename:true,
        unique_filename:false, 
        resource_type:'auto'
      })
      // if(!data){
      //   return next(new Error("no data",{cause:400}))
      // } 
      const book = await bookModel.findByIdAndUpdate(_id,{imageurl:{ secure_url,public_id}},{new:true})
      if(!book){
        await cloudinary.uploader.destroy(public_id)//only one
        // await cloudinary.api.delete_all_resources([publicids])// delete bulk of publicids
      }
      res.status(200).json({message:'done',book})
})
export const upoladPdfBook = asyncHandler(async(req,res,next)=>{
    const {_id}=req.params//of book
    if(!req.file){ 
        return next(new Error("no pdf file uploaded",{cause:400}))
        }
        const {secure_url,public_id}  = await cloudinary.uploader.upload(req.file.path,{
            folder:`book/pdf/${_id}`,
            // public_id:`${_id}`
            use_filename:true,
            unique_filename:false, 
            resource_type:'auto'
          })
          // if(!data){
          //   return next(new Error("no data",{cause:400}))
          // } 
          const book = await bookModel.findByIdAndUpdate(_id,{pdfurl:{secure_url,public_id}},{new:true})
        //   if(!book){
        //     await cloudinary.uploader.destroy(public_id)//only one
        //     // await cloudinary.api.delete_all_resources([publicids])// delete bulk of publicids
        //   }
          res.status(200).json({message:'done',book})
})
export const updateTiteDesc = asyncHandler(async(req,res,next)=>{

})