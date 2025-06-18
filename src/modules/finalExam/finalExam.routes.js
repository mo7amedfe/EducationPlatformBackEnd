import { Router } from 'express'
const router = Router()
import * as fe from './finalExam.controller.js'


router.get('/python',fe.showPythonQs)
router.get('/SJ',fe.showScratchJouniorQs)
router.get('/S3',fe.showScratch3Qs)
router.get('/pythonAdv',fe.showpythonAdvQs)

router.post('/python',fe.submitPython)
router.post('/sj',fe.submitSJ)
router.post('/s3',fe.submitS3)
router.post('/pythonAdv',fe.submitpyAdv)

// router.post('/submit',ps.submit)





export default router
