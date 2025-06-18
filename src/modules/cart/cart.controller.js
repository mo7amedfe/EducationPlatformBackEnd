import { cartModel } from "../../../connections/models/cart.model.js";
import { courseModel } from "../../../connections/models/course.model.js";
import { asyncHandler } from "../../utils/errorHandeling.js";

// ======================= GET Cart ==================
export const getCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.authuser;

  const cart = await cartModel.findOne({ userId: _id })
    .populate('courses.courseId');

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  res.status(200).json({ message: 'Cart fetched successfully', cart });
});

// ======================= Add to Cart ==================
export const addToCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.authuser;
  const userId = _id;
  const { courseId, schedule } = req.body;

  if (!courseId || !schedule || !schedule.day || !schedule.time) {
    return res.status(400).json({ message: "courseId and schedule (day and time) are required" });
  }

  const courseCheck = await courseModel.findById(courseId);
  if (!courseCheck) {
    return next(new Error("Invalid course ID", { cause: 400 }));
  }

  // Verify that the schedule exists in the course
  const scheduleExists = courseCheck.schedules.some(
    s => s.day === schedule.day && s.time === schedule.time
  );

  if (!scheduleExists) {
    return next(new Error("Invalid schedule for this course", { cause: 400 }));
  }

  let userCart = await cartModel.findOne({ userId });

  if (userCart) {
    const courseExists = userCart.courses.some(
      (item) => item.courseId.toString() === courseId
    );

    if (courseExists) {
      return res.status(400).json({ message: "Course already in cart" });
    }

    userCart.courses.push({ courseId, schedule });
    userCart.total += courseCheck.price;

    await userCart.save();

    return res.status(200).json({ message: "Course added to cart", cart: userCart });
  } else {
    const cartObject = {
      userId,
      courses: [{ courseId, schedule }],
      total: courseCheck.price,
    };

    const cartDB = await cartModel.create(cartObject);
    return res.status(201).json({ message: "Cart created", cart: cartDB });
  }
});

// ======================= Delete Course from Cart ==================
export const deleteCourseFromCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.authuser;
  const userId = _id;
  const { courseId } = req.body;

  const courseCheck = await courseModel.findById(courseId);
  if (!courseCheck) {
    return next(new Error("Invalid course ID", { cause: 400 }));
  }

  const userCart = await cartModel.findOne({ userId, "courses.courseId": courseId });
  if (!userCart) {
    return next(new Error("Course not found in cart", { cause: 404 }));
  }

  const courseIndex = userCart.courses.findIndex(
    (item) => item.courseId.toString() === courseId
  );

  if (courseIndex === -1) {
    return next(new Error("Course not found in cart", { cause: 404 }));
  }

  userCart.courses.splice(courseIndex, 1);
  userCart.total -= courseCheck.price;

  await userCart.save();

  res.status(200).json({ message: "Course removed from cart", cart: userCart });
});

// ======================= Update Schedule in Cart ==================
export const updateScheduleInCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.authuser;
  const userId = _id;
  const { courseId, newSchedule } = req.body;

  if (!newSchedule || !newSchedule.day || !newSchedule.time) {
    return res.status(400).json({ message: "New schedule (day and time) is required" });
  }

  const userCart = await cartModel.findOne({ userId });
  if (!userCart) {
    return next(new Error("Cart not found", { cause: 404 }));
  }

  const course = userCart.courses.find(
    (item) => item.courseId.toString() === courseId
  );

  if (!course) {
    return next(new Error("Course not found in cart", { cause: 404 }));
  }

  // Verify that the new schedule exists in the course
  const courseCheck = await courseModel.findById(courseId);
  const scheduleExists = courseCheck.schedules.some(
    s => s.day === newSchedule.day && s.time === newSchedule.time
  );

  if (!scheduleExists) {
    return next(new Error("Invalid schedule for this course", { cause: 400 }));
  }

  course.schedule = newSchedule;
  await userCart.save();

  return res.status(200).json({ message: "Schedule updated in cart", cart: userCart });
});

// ======================= Clear Cart ==================
export const clearCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.authuser;

  const cart = await cartModel.findOne({ userId: _id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.courses = [];
  cart.total = 0;
  await cart.save();

  return res.status(200).json({ message: "Cart cleared successfully", cart });
});
