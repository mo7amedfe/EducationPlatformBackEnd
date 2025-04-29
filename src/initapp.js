// import mongoose from "mongoose";
// import cors from "cors";

// import { bookRooter, feedbackRouter, userRouter, plasementTest, course } from "./allroutes.js"
// export const initapp = (app, express) => {
//   const port = process.env.PORT

//   app.use(express.json())
//   app.use(cors())
//   app.use('/user', userRouter)
//   app.use('/feedback', feedbackRouter)
//   app.use('/book', bookRooter)
//   app.use('/PT', plasementTest)
//   app.use('/course', course)

//   app.use('/test', (req, res, next) =>
//     res.status(200).json({ message: 'tes' }),
//   )
//   app.all('*', (req, res, next) =>
//     res.status(404).json({ message: '404 Not Found UL' }),
//   )
//   app.use((err, req, res, next) => {
//     if (err) {
//       return res.status(err['cause'] || 500).json({ message: err.message })
//     }
//   })
//   mongoose.connect(process.env.DB_URL || "").then(() => {
//     console.log("connected to database")
//   })
//   app.listen(port, () => console.log(`Example app listening on port ${port}!`))


// }

// for vercel


import mongoose from "mongoose";
import cors from "cors";
import {
  bookRooter,
  feedbackRouter,
  userRouter,
  plasementTest,
  course,
} from "./allroutes.js";

export const initapp = (app, express) => {
  app.use(express.json());
  app.use(cors());

  app.use("/user", userRouter);
  app.use("/feedback", feedbackRouter);
  app.use("/book", bookRooter);
  app.use("/PT", plasementTest);
  app.use("/course", course);

  app.use("/test", (req, res) =>
    res.status(200).json({ message: "test" })
  );

  app.all("*", (req, res) =>
    res.status(404).json({ message: "404 Not Found UL" })
  );

  app.use((err, req, res, next) => {
    if (err) {
      return res
        .status(err["cause"] || 500)
        .json({ message: err.message });
    }
  });

  mongoose.connect(process.env.DB_URL || "").then(() => {
    console.log("connected to database");
  });
};
