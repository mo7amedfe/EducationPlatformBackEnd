import { cartModel } from "../../../connections/models/cart.model.js";
import { orderModel } from "../../../connections/models/order.model.js";
import { courseModel } from "../../../connections/models/course.model.js";
import { scheduleModel } from "../../../connections/models/schedule.model.js"; 
import { paymentFunction } from "../../utils/payment.js";
import { userModel } from "../../../connections/models/user.model.js";
import { generateToken } from "../../utils/tokenFunction.js";
import { asyncHandler } from "../../utils/errorHandeling.js";
import { enrolledCoursesModel } from "../../../connections/models/enrolledcoureces.model.js";





// =============== convert cart to order =======================//



export const createOrderFromCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.authuser;
  const userId = _id;
  const { cartId, paymentMethod } = req.body;

  if (!cartId) {
    return res.status(400).json({ message: "Cart ID is required" });
  }

  const cart = await cartModel.findById(cartId).populate('courses.courseId');
  if (!cart || cart.courses.length === 0) {
    return res.status(400).json({ message: "Cart is empty or not found" });
  }

  // Prepare courses data
  const orderCourses = cart.courses.map(item => ({
    courseId: item.courseId._id,
    title: item.courseId.title,
    price: item.courseId.price,
    selectedSchedule: item.schedule
  }));

  // Calculate total
  const total = orderCourses.reduce((sum, course) => sum + course.price, 0);

  // Create order
  const newOrder = await orderModel.create({
    userId: cart.userId,
    courses: orderCourses,
    total: total,
    paymentMethod: paymentMethod || "cash"
  });

  // Handle payment if card payment
  let orderSession;
  if (paymentMethod === 'card') {
    const user = await userModel.findById(_id);
    const token = generateToken({
      payload: { orderId: newOrder._id },
      signature: process.env.ORDER_TOKEN,
      expiresIn: '1h'
    });

    orderSession = await paymentFunction({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user.email,
      metadata: { orderId: newOrder._id.toString() },
      success_url: `${req.protocol}://${req.headers.host}/order/successOrder?token=${token}`,
      cancel_url: `${req.protocol}://${req.headers.host}/order/cancelOrder?token=${token}`,
      line_items: orderCourses.map(course => ({
        price_data: {
          currency: 'EGP',
          product_data: {
            name: course.title,
          },
          unit_amount: course.price * 100,
        },
        quantity: 1
      }))
    });
  }

  // Create enrolled courses record
  await enrolledCoursesModel.create({
    userid: userId,
    courses: orderCourses.map(course => ({
      courseId: course.courseId,
      selectedSchedule: course.selectedSchedule
    }))
  });

  // Delete cart after successful order
  await cartModel.findByIdAndDelete(cartId);

  return res.status(201).json({
    message: "Order created successfully",
    order: newOrder,
    checkoutUrl: orderSession?.url
  });
});

export const putInDataBase = asyncHandler(async(req,res,next)=>{
  const {_id}=req.authuser
  const {cartId}=req.body
  if (!cartId) {
    return res.status(400).json({ message: "Cart ID is required" });
  }

  const cart = await cartModel.findById(cartId);
  if (!cart || cart.courses.length === 0) {
    return res.status(400).json({ message: "Cart is empty or not found" });
  }

  if (!cart.schedule) {
    return res.status(400).json({ message: "No schedule found in cart" });
  }

  // تجهيز بيانات الكورسات
  const orderCourses = await Promise.all(
    cart.courses.map(async (item) => {
      const course = await courseModel.findById(item.courseId);
      if (!course) return null;

      return {
        productId: course._id,
      };
    }));
    const filteredCourses = orderCourses.filter(Boolean);
    if (filteredCourses.length === 0) {
      return res.status(400).json({ message: "No valid courses found in cart" });
    }

    const newOrder = await enrolledCoursesModel.create({
      userid: cart.userId,
      courses: filteredCourses,
      schedule: cart.schedule,
    });
})

// Get user's enrolled courses
export const getEnrolledCourses = asyncHandler(async (req, res, next) => {
  const { _id, role } = req.authuser;

  if (role === 'Admin') {
    // Return all courses for admin
    const allCourses = await courseModel.find({});
    const formattedCourses = allCourses.map(course => ({
      courseId: course._id,
      title: course.title,
      description: course.description,
      price: course.price,
      image: course.imageurl,
      selectedSchedule: course.schedules[0],
      availableSchedules: course.schedules
    }));
    return res.status(200).json({
      message: "All courses for admin",
      courses: formattedCourses
    });
  }

  // Find user's enrolled courses and populate course details
  const enrolledCourses = await enrolledCoursesModel.find({ userid: _id })
    .populate({
      path: 'courses.courseId',
      select: 'title description price imageurl schedules'
    });

  if (!enrolledCourses) {
    return res.status(404).json({ message: "No enrolled courses found" });
  }

  // Format the response
  const formattedCourses = enrolledCourses.flatMap(enrolled =>
    enrolled.courses.map(course => ({
      courseId: course.courseId._id,
      title: course.courseId.title,
      description: course.courseId.description,
      price: course.courseId.price,
      image: course.courseId.imageurl,
      selectedSchedule: course.selectedSchedule,
      availableSchedules: course.courseId.schedules
    }))
  );

  return res.status(200).json({
    message: "Enrolled courses retrieved successfully",
    courses: formattedCourses
  });
});


























// فكك من دول يا اياد متمسحهمش كنت بجرب حاجة


// export const createOrderFromCart = async (req, res, next) => {
//   try {
//     const { _id } = req.authuser;
//     const userId = _id;
//     const { cartId, scheduleId, paymentMethod } = req.body;

//     if (!cartId || !scheduleId) {
//       return res.status(400).json({ message: "Cart ID and Schedule ID are required" });
//     }

//     const cart = await cartModel.findById(cartId);
//     if (!cart || cart.courses.length === 0) {
//       return res.status(400).json({ message: "Cart is empty or not found" });
//     }

//     // تحقق من وجود الجدول في قاعدة البيانات
//     const scheduleCheck = await scheduleModel.findById(scheduleId);
//     if (!scheduleCheck) {
//       return res.status(400).json({ message: "Invalid Schedule ID" });
//     }

//     // إعداد الكورسات
//     const orderCourses = await Promise.all(
//       cart.courses.map(async (item) => {
//         const course = await courseModel.findById(item.courseId);
//         if (!course) return null;

//         return {
//           productId: course._id,
//           title: course.title,
//           price: course.price,
//         };
//       })
//     );

//     const filteredCourses = orderCourses.filter(Boolean);

//     if (filteredCourses.length === 0) {
//       return res.status(400).json({ message: "No valid courses found in cart" });
//     }

//     // إنشاء الطلب
//     const newOrder = await orderModel.create({
//       userId: cart.userId,
//       courses: filteredCourses,
//       schedule: scheduleId,
//       total: cart.total,
//       paymentMethod: paymentMethod || "cash",
//     });

//     // حذف السلة
//     await cartModel.findByIdAndDelete(cartId);

//     return res.status(201).json({ message: "Order created", order: newOrder });

//   } catch (error) {
//     console.error(error);
//     return next(error);
//   }
// };

// export const createOrderFromCart = async (req, res, next) => {
//   try {
//     const { _id } = req.authuser;
//     const userId = _id;
//     const { cartId, paymentMethod } = req.body;

//     if (!cartId) {
//       return res.status(400).json({ message: "Cart ID is required" });
//     }

//     // جلب السلة
//     const cart = await cartModel.findById(cartId);

//     if (!cart || cart.courses.length === 0) {
//       return res.status(400).json({ message: "Cart is empty or not found" });
//     }

//     // التحقق من وجود جدول داخل السلة
//     if (!cart.schedule) {
//       return res.status(400).json({ message: "No schedule found in cart" });
//     }

//     // تجهيز بيانات الكورسات
//     const orderCourses = await Promise.all(
//       cart.courses.map(async (item) => {
//         const course = await courseModel.findById(item.courseId);
//         if (!course) return null;

//         return {
//           productId: course._id,
//           title: course.title,
//           price: course.price,
//         };
//       })
//     );

//     const filteredCourses = orderCourses.filter(Boolean);
//     if (filteredCourses.length === 0) {
//       return res.status(400).json({ message: "No valid courses found in cart" });
//     }

//     // إنشاء الطلب باستخدام الجدول الموجود في cart
//     const newOrder = await orderModel.create({
//       userId: cart.userId,
//       courses: filteredCourses,
//       schedule: cart.schedule,
//       total: cart.total,
//       paymentMethod: paymentMethod || "cash",
//     });

//     // حذف السلة بعد التحويل
//     await cartModel.findByIdAndDelete(cartId);

//     return res.status(201).json({ message: "Order created", order: newOrder });

//   } catch (error) {
//     console.error(error);
//     return next(error);
//   }
// };




// // =============== convert cart to order =======================//
// export const createOrderFromCart = async (req, res, next) => {
//   try {
//     const { _id } = req.authuser;
//     const userId = _id;
//     const { cartId, paymentMethod } = req.body;

//     if (!cartId) {
//       return res.status(400).json({ message: "Cart ID is required" });
//     }

//     const cart = await cartModel.findById(cartId);

//     if (!cart || cart.courses.length === 0 ) {
//       return res.status(400).json({ message: "Cart is empty or not found" });
//     }

//     // Prepare course details
//     const orderCourses = await Promise.all(
//       cart.courses.map(async (item) => {
//         const course = await courseModel.findById(item.courseId);
//         if (!course) return null;

//         return {
//           productId: course._id,
//           title: course.title,
//           price: course.price,
//         };
//       })
//     );

//     // Remove any null values (in case a course was not found)
//     const filteredCourses = orderCourses.filter(Boolean);

//     if (filteredCourses.length === 0) {
//       return res.status(400).json({ message: "No valid courses found in cart" });
//     }

//     const newOrder = await orderModel.create({
//       userId: cart.userId,
//       courses: filteredCourses,
//       total: cart.total,
//       paymentMethod: paymentMethod || "cash", // default value
//     });

//     // Optionally delete the cart
//     await cartModel.findByIdAndDelete(cartId);

//     return res.status(201).json({ message: "Order created", order: newOrder });

//   } catch (error) {
//     console.error(error);
//     return next(error);
//   }
// };