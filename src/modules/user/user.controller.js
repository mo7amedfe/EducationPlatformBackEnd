import { userModel } from '../../../connections/models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { asyncHandler } from '../../utils/errorHandeling.js'
import cloudinary from '../../utils/cloudinaryConfigration.js'

//========================= Sign Up ==================
export const SignUp = asyncHandler(async (req, res, next) => {
  // try {
  const { username, email, password, cPassword, gender } = req.body
  // email check
  const isUserExists = await userModel.findOne({ email })
  if (isUserExists) {
    return res.status(400).json({ message: 'Email is already exist' })
  }
  // hashing password
  const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)
  const userInstance = new userModel({
    username,
    email,
    password: hashedPassword,
    gender,
  })
  await userInstance.save()

  const savedUser = userInstance.toObject();
  delete savedUser.password;
  res.status(201).json({ message: 'Done', user: savedUser })

}

)
//========================== Sign In ========================
export const SignIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  const isUserExists = await userModel.findOne({ email })
  if (!isUserExists) {
    // return res.status(400).json({ message: 'Invalid login credentials' })
    return next(new Error("Invalid login credentials email", { cause: 400 }))
  }
  const passMatch = bcrypt.compareSync(password, isUserExists.password) // return boolean
  if (!passMatch) {
    return res.status(400).json({ message: 'Invalid login credentials' })
  }

  const userToken = jwt.sign({ email, _id: isUserExists._id, username: isUserExists.username }, 'testToken')
  res.status(200).json({ message: 'loggedIn success', userToken })

})

//========================== Update profile =================


export const updateProfile = asyncHandler(async (req, res, next) => {
  const { _id } = req.authuser;
  const { email, username } = req.body;

  const currentUser = await userModel.findById(_id);
  if (!currentUser) {
    return res.status(400).json({ message: 'User not found' });
  }

  // لو الإيميل اختلف، نتاكد إنه مش مستخدم من حد تاني
  if (email && email !== currentUser.email) {
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email is already in use' });
    }
  }

  // نحدث البيانات
  const updated = await userModel.updateOne(
    { _id },
    {
      ...(username && { username }),
      ...(email && { email }),
    }
  );

  if (updated.modifiedCount) {
    const updatedUser = await userModel.findById(_id);

    const token = jwt.sign(
      {
        _id: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
      },
      'testToken',
      { expiresIn: '1y' }
    );

    return res.status(200).json({ message: 'Update done', token });
  }

  res.status(400).json({ message: 'Update failed' });
});


//========================== get user =======================

export const getUserProfile = asyncHandler(async (req, res) => {
 
  const { _id } = req.authuser
  const user = await userModel.findById(_id)
  if (user) {
    return res.status(200).json({ message: 'Done', user })
  }
  return res.status(404).json({ message: 'invalid id' })
 
})
/////////////////////////////////////////////////////////////////////////
export const uploudProfilePic = asyncHandler(async(req,res,next)=>{
  const {_id}=req.authuser
  if(!req.file){ 
    return next(new Error("no file uploaded",{cause:400}))
  }
  const {secure_url,public_id}  =await cloudinary.uploader.upload(req.file.path,{
    folder:`user/profilePic/${_id}`,
    // public_id:`${_id}`
    use_filename:true,
    unique_filename:false, 
    resource_type:'auto'
  })
  // if(!data){
  //   return next(new Error("no data",{cause:400}))
  // } 
  const user = await userModel.findByIdAndUpdate(_id,{profile_pic:{secure_url,public_id}},{new:true})
  if(!user){
    await cloudinary.uploader.destroy(public_id)//only one
    // await cloudinary.api.delete_all_resources([publicids])// delete bulk of publicids
  }
  res.status(200).json({message:'done',user})
})

export const coverPictures = async (req, res, next) => {
  const { _id } = req.authUser
  if (!req.files) {
    return next(new Error('please upload pictures', { cause: 400 }))
  }

  const coverImages = []
  for (const file in req.files) {
    for (const key of req.files[file]) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        key.path,
        {
          folder: `Users/Covers/${_id}`,
          resource_type: 'image',
        },
      )
      coverImages.push({ secure_url, public_id })
    }
  }
  const user = await userModel.findById(_id)

  user.coverPictures.length
    ? coverImages.push(...user.coverPictures)
    : coverImages

  const userNew = await userModel.findByIdAndUpdate(
    _id,
    {
      coverPictures: coverImages,
    },
    {
      new: true,
    },
  )
  res.status(200).json({ message: 'Done', userNew })
}