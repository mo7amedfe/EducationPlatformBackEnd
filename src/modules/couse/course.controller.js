import { courseModel } from "../../../connections/models/course.model.js";
import cloudinary from "../../utils/cloudinaryConfigration.js";
import { asyncHandler } from "../../utils/errorHandeling.js";




// =============== add courses =================//


export const addCourse = asyncHandler (async(req,res,next)=>{
    const { title, description } = req.body;

    if (!title || !description) {
      res.status(400);
      throw new Error("title and describtion is required");
    }
  
    const course = await courseModel.create({
      title,
      description
    });
  
    res.status(201).json({message:"added done ", course});
  });


// =============== show courses =================//



export const getCourses = asyncHandler(async (req, res) => {
    const courses = await courseModel.find({});
    res.json(courses);
  });
/////////////////////////upload photo///////////////////////
export const uploadbookPic = asyncHandler(async(req,res,next)=>{
    const {_id}=req.params//of book
    if(!req.file){ 
        return next(new Error("no pic file uploaded",{cause:400}))
        }
     const {secure_url,public_id}  = await cloudinary.uploader.upload(req.file.path,{
        folder:`course/cover/${_id}`,
        // public_id:`${_id}`
        use_filename:true,
        unique_filename:false, 
        resource_type:'auto'
      })
      // if(!data){
      //   return next(new Error("no data",{cause:400}))
      // } 
      const coruse = await courseModel.findByIdAndUpdate(_id,{imageurl:{ secure_url,public_id}},{new:true})
      if(!coruse){
        await cloudinary.uploader.destroy(public_id)//only one
        // await cloudinary.api.delete_all_resources([publicids])// delete bulk of publicids
      }
      res.status(200).json({message:'done',coruse})
})