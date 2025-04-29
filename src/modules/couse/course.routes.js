import { Router } from 'express'
const router = Router()
import * as course from './course.controller.js'
import { multercloudFunction } from '../../services/multerCloudenary.js'
import { allowedExtensions } from '../../utils/allowedExtentions.js'
import { isAuth } from '../../middelwares/auth.js'


router.post('/',course.addCourse)
router.get('/',course.getCourses)
router.post('/uploadPic/:_id',isAuth(),multercloudFunction(allowedExtensions.Image).single('profile'),course.uploadbookPic)




export default router