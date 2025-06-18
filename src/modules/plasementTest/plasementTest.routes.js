import { Router } from 'express'
const router = Router()
import * as ps from './plasementTest.controller.js'


router.get('/show',ps.showQS)
router.post('/submit',ps.submit)





export default router
