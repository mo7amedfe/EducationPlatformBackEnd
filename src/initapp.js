import mongoose from "mongoose"
import cors from "cors"


import { bookRooter, feedbackRouter, userRouter, plasementTest,course,schedule,cart,order, leason,finalExam} from "./allroutes.js"
import submittedAssignmentRoutes from "./modules/submittedAssignment/submittedAssignment.routes.js"
import finalTestRoutes from "./modules/finalTest/finalTest.routes.js"

export const initapp = (app, express)=>{
    const port =  process.env.PORT
app.use(express.json())
app.use(cors())
app.use('/user', userRouter)
app.use('/feedback', feedbackRouter)
app.use('/book', bookRooter)
app.use('/PT',plasementTest)
app.use('/course',course)
app.use('/schedule',schedule)
app.use('/cart',cart)
app.use('/order',order)
app.use('/leason',leason)
app.use('/finalExam',finalExam)
app.use('/submittedAssignment', submittedAssignmentRoutes)
app.use('/finalTest', finalTestRoutes)



app.use('/test', (req, res, next) =>
  res.status(200).json({ message: 'tes' }),
)
app.all('*', (req, res, next) =>
    res.status(404).json({ message: '404 Not Found UL' }),
  )
app.use((err,req,res,next)=>{
  if(err){
    return res.status(err['cause'] ||500).json({message:err.message})
  }
})
mongoose.connect(process.env.DB_URL || "").then(()=>{
  console.log("connected to database")
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

}
