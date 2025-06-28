# Education Platform Backend

A comprehensive Node.js backend API for an education platform with user management, course management, assignment submission, and final test features.

## Features

- **User Management**: Registration, authentication, and role-based access control (User, Instructor, Admin)
- **Course Management**: Create, update, and manage courses with lessons and assignments
- **Assignment System**: Submit, review, and grade assignments
- **Final Test System**: Create, manage, and grade final tests
- **File Upload**: Support for PDF, image, and video uploads
- **Payment Integration**: Stripe payment processing
- **Cloud Storage**: Cloudinary integration for file storage

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **Payment**: Stripe
- **Validation**: Joi
- **CORS**: Enabled for cross-origin requests

## Prerequisites

- Node.js 18.0.0 or higher
- MongoDB database
- Cloudinary account (for file storage)
- Stripe account (for payments)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DB_URL=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Other Configuration
SALT_ROUNDS=10
ORDER_TOKEN=your_order_token
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd education-platform-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see above)

4. Start the development server:
```bash
npm run dev
```

5. For production:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /user` - User registration
- `POST /user/login` - User login
- `GET /user` - Get user profile
- `PUT /user` - Update user profile

### Courses
- `POST /course` - Create course (Admin/Instructor)
- `GET /course` - Get all courses
- `DELETE /course/:courseId` - Delete course

### Lessons
- `POST /leason` - Create lesson (Admin/Instructor)
- `GET /leason/course/:courseId` - Get lessons by course
- `PUT /leason/:lessonId` - Update lesson
- `DELETE /leason/:lessonId` - Delete lesson

### Assignments
- `POST /submittedAssignment/lesson/:lessonId/submit` - Submit assignment
- `GET /submittedAssignment/review` - Review all submissions (Admin/Instructor)
- `POST /submittedAssignment/:submissionId/grade` - Grade submission (Admin/Instructor)

### Final Tests
- `POST /finalTest/course/:courseId/create` - Create final test (Admin/Instructor)
- `PUT /finalTest/course/:courseId/update` - Update final test (Admin/Instructor)
- `DELETE /finalTest/course/:courseId/delete` - Delete final test (Admin/Instructor)
- `GET /finalTest/course/:courseId/file` - Get final test file
- `POST /finalTest/course/:courseId/submit` - Submit final test

### Orders & Cart
- `POST /cart/add` - Add course to cart
- `POST /order/createFromCart` - Create order from cart
- `GET /order/enrolledCourses` - Get enrolled courses

## Role-Based Access Control

### User Roles
- **User**: Can enroll in courses, submit assignments, take final tests
- **Instructor**: Can create/manage courses, grade assignments and final tests
- **Admin**: Full system access including user management

## Deployment

### Vercel Deployment

1. **Install Vercel CLI** (optional):
```bash
npm i -g vercel
```

2. **Deploy to Vercel**:
```bash
vercel
```

3. **Set Environment Variables in Vercel Dashboard**:
   - Go to your project in Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add all the environment variables from your `.env` file

4. **Configure Custom Domain** (optional):
   - In Vercel dashboard, go to Settings > Domains
   - Add your custom domain

### Manual Deployment Steps

1. **Push to GitHub**:
```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:

```env
NODE_ENV=production
DB_URL=your_production_mongodb_url
JWT_SECRET=your_production_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
SALT_ROUNDS=10
ORDER_TOKEN=your_order_token
```

## File Upload Configuration

The application supports file uploads for:
- Assignment submissions (PDF)
- Final test files (PDF)
- Course images
- Book files and images
- Lesson videos

Files are stored using:
- **Local storage**: For development (uploads/ directory)
- **Cloudinary**: For production (recommended)

## Database Schema

The application uses MongoDB with the following main collections:
- Users
- Courses
- Lessons
- Submitted Assignments
- Final Tests
- Submitted Final Tests
- Orders
- Carts
- Books
- Feedback

## Security Features

- JWT-based authentication
- Role-based access control
- Input validation with Joi
- CORS protection
- File upload restrictions
- Environment variable protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License

## Support

For support and questions, please contact the development team or create an issue in the repository. 