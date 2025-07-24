import { Router } from 'express'

const router = Router()
import * as order from './order.controller.js'
import { isAuth } from '../../middelwares/auth.js'


router.post('/', isAuth(),order.createOrderFromCart)
router.get('/enrolled-courses', isAuth(), order.getEnrolledCourses)



export default router