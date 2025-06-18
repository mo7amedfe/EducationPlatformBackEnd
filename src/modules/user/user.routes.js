import { Router } from 'express'
const router = Router()
import * as ur from './user.controller.js'
import { isAuth } from '../../middelwares/auth.js'
import {  validationCoreFunction } from '../../middelwares/validation.js'
import { SignInSchema, SignUpSchema } from './user.validationSchema.js'
import { multercloudFunction } from '../../services/multerCloudenary.js'
import { allowedExtensions } from '../../utils/allowedExtentions.js'



router.post('/',validationCoreFunction(SignUpSchema),ur.SignUp)
router.post('/login',validationCoreFunction(SignInSchema), ur.SignIn)
router.patch('/', isAuth(),ur.updateProfile)   //update only one
router.get('/', isAuth(),ur.getUserProfile)
router.post('/profile',isAuth(),multercloudFunction(allowedExtensions.Image).single('profile'),ur.uploudProfilePic)
router.post(
    '/cover',
    isAuth(),
    multercloudFunction(allowedExtensions.Image, 'User/Covers').fields([
      { name: 'cover', maxCount: 1 },
      { name: 'image', maxCount: 2 },
    ]),
    ur.coverPictures   
  )
router.post('/Admin',isAuth(),ur.tryadmin)
router.get('/allUsers',isAuth(),ur.getallusers)
router.delete('/deleteUser', isAuth(), ur.deleteUserByAdmin);

export default router
