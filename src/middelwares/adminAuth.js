import jwt from "jsonwebtoken";

// export const checkAdmin = () => {

export const checkAdmin = () => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "testToken");

    if (decoded.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    req.user = decoded;
    next();
  };
};

export const checkInstructor = () => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "testToken");

    if (decoded.role !== "Instructor") {
      return res.status(403).json({ message: "Access denied. Instructors only." });
    }
    req.user = decoded;
    next();
  };
};

export const checkAdminOrInstructor = () => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "testToken");

    if (decoded.role !== "Admin" && decoded.role !== "Instructor") {
      return res.status(403).json({ message: "Access denied. Admin or Instructor access required." });
    }
    req.user = decoded;
    next();
  };
};
