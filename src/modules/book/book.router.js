import { Router } from 'express'

const router = Router()
import * as boo from './book.controler.js'
import { isAuth } from '../../middelwares/auth.js'
import { multercloudFunction } from '../../services/multerCloudenary.js'
import { allowedExtensions } from '../../utils/allowedExtentions.js'
import { checkAdmin } from '../../middelwares/adminAuth.js'


router.post('/', isAuth(),checkAdmin(),boo.uploudBook)
router.post('/uploadPic/:_id',isAuth(),checkAdmin(),multercloudFunction(allowedExtensions.Image).single('profile'),boo.uploadbookPic)
router.post('/uploadpdf/:_id',isAuth(),checkAdmin(),multercloudFunction(allowedExtensions.Files).single('pdf'),boo.upoladPdfBook)
export default router