import { Router } from 'express'

const router = Router()
import * as cart from './cart.controller.js'
import { isAuth } from '../../middelwares/auth.js'

router.get('/getCart', isAuth(), cart.getCart);
router.post('/addToCart', isAuth(),cart.addToCart)
router.delete('/course', isAuth(),cart.deleteCourseFromCart)
router.delete('/clear', isAuth(), cart.clearCart);

export default router

