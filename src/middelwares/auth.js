import jwt from 'jsonwebtoken'
import { userModel } from '../../connections/models/user.model.js'


export const isAuth = () => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ message: "Please send a valid token in the Authorization header" });
    }

    const token = authHeader.split(" ")[1]; // extract the actual token


    try {
      const decodedData = jwt.verify(token, "testToken");
      
      if (!decodedData || !decodedData._id) {
        return res.status(400).json({ message: "Invalid token" });
      }

      const findUser = await userModel.findById(decodedData._id);

      if (!findUser) {
        return res.status(400).json({ message: "Please sign up first" });
      }

      req.authuser = findUser;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token verification failed", error: error.message });
    }
  };
};