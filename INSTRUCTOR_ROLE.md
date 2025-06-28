# Instructor Role Implementation

## Overview
The instructor role has been added to the education platform to allow instructors to review assignments and final tests, as well as manage course content.

## Role Capabilities

### Authentication & Authorization
- **Role Value**: `"Instructor"`
- **Middleware**: `checkInstructor()` - for instructor-only routes
- **Middleware**: `checkAdminOrInstructor()` - for routes accessible by both admin and instructor

### Assignment Management
Instructors can:
- ✅ Review all assignment submissions (`GET /submittedAssignment/review`)
- ✅ Grade assignment submissions (`POST /submittedAssignment/:submissionId/grade`)
- ✅ Download assignment submissions (`GET /submittedAssignment/:submissionId/download`)

### Final Test Management
Instructors can:
- ✅ Create final tests for courses (`POST /finalTest/course/:courseId/create`)
- ✅ Update final tests (`PUT /finalTest/course/:courseId/update`)
- ✅ Delete final tests (`DELETE /finalTest/course/:courseId/delete`)
- ✅ Get final test information (`GET /finalTest/course/:courseId/info`)
- ✅ Review all final test submissions (`GET /finalTest/review`)
- ✅ Grade final test submissions (`POST /finalTest/:submissionId/grade`)
- ✅ Download student final test submissions (`GET /finalTest/submission/:submissionId/download`)
- ✅ Access final test files without restrictions (`GET /finalTest/course/:courseId/file`)

### Course Management
Instructors can:
- ✅ Create new courses (`POST /course`)
- ✅ Upload course cover images (`POST /course/courseCover`)
- ✅ Create lessons (`POST /leason`)
- ✅ Add videos to lessons (`POST /leason/:lessonId/video`)
- ✅ Upload assignments (`POST /leason/:lessonId/assignment`)
- ✅ Update and delete lessons

### Book Management
Instructors can:
- ✅ Upload books (`POST /book`)
- ✅ Upload book cover images (`POST /book/uploadPic/:_id`)
- ✅ Upload book PDFs (`POST /book/uploadpdf/:_id`)

### Course Access
Instructors can:
- ✅ View all courses (not just enrolled ones) (`GET /order/enrolledCourses`)

## Database Changes
- Updated `user.model.js` to include `'Instructor'` in the role enum
- Updated `systemRole.js` to include the `INSTRUCTOR` constant

## Middleware Changes
- Added `checkInstructor()` middleware for instructor-only access
- Added `checkAdminOrInstructor()` middleware for shared admin/instructor access
- Updated existing routes to use appropriate middleware

## API Endpoints Updated
- Assignment submission routes
- Final test routes (including new CRUD operations)
- Course management routes
- Lesson management routes
- Book management routes
- Order/course access routes

## Final Test Management API

### Create Final Test
```http
POST /finalTest/course/:courseId/create
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: finalTestFile (PDF file)
```

### Update Final Test
```http
PUT /finalTest/course/:courseId/update
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: finalTestFile (PDF file)
```

### Delete Final Test
```http
DELETE /finalTest/course/:courseId/delete
Authorization: Bearer <token>
```

### Get Final Test Info
```http
GET /finalTest/course/:courseId/info
Authorization: Bearer <token>
```

## Usage Example
To create an instructor account, set the role to "Instructor" during signup:
```json
{
  "username": "instructor1",
  "email": "instructor@example.com",
  "password": "password123",
  "cPassword": "password123",
  "role": "Instructor"
}
```

## Security Notes
- Instructors have similar privileges to admins for educational content
- They cannot delete users or access admin-only system functions
- All instructor actions are logged and can be audited
- Final tests cannot be deleted if there are existing submissions 