import { Router } from 'express'

const router = Router()
import * as fb from './feedback.controller.js'
import { isAuth } from '../../middelwares/auth.js'


router.post('/', fb.sendMessage)
router.get('/',isAuth(),fb.getUserMessages)
router.delete('/',isAuth(), fb.deleteMessage)

export default router