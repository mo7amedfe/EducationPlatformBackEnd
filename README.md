# 📚 Educational Platform

A full-featured, role-based e-learning platform built with Angular and Node.js. It allows Admins, Instructors, and Students to interact within a dynamic learning environment, supporting course creation, enrollment, assignments, tests, and feedback.

---
# Frontend Repo Link

https://github.com/mo7amedfe/EducationPlatform

## 🚀 Features

### 👨‍🎓 Student Role
- Register or log in as a student
- Browse and enroll in available courses
- Access course content (videos, files, etc.)
- Submit assignments and take final tests
- Receive feedback from instructors
- View grades and submissions

### 🧑‍🏫 Instructor Role
- Log in and access instructor dashboard
- Create and manage courses
- Add lessons, upload video content and resources
- Create assignments and **final tests** for each course
- **Review student submissions and final test answers**
- **Provide feedback and grades for assignments and tests**

### 🛠 Admin Role
- Log in to the admin panel
- View and manage all users (students & instructors)
- Create and manage courses
- Add or remove lessons or tests
- Maintain the integrity and structure of the platform

---

## 🧪 Demo Credentials

You can use the following demo accounts to test the system:

### 🔐 Admin Login
- **Email:** `admin@gmail.com`  
- **Password:** `@Mm123456`

### 👨‍🏫 Instructor Login
- **Email:** `ins@gmail.com`  
- **Password:** `@Mm123456`

### 👨‍🎓 Student Login
- **Email:** `std@gmail.com`  
- **Password:** `@Mm12345`  
Or you can register a new student account from the login page.

---

## 🧰 Tech Stack

- **Frontend:** Angular 19, RxJS, Angular Forms, bootstrap  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT-based login system  
- **File Uploads:** Cloudinary 
- **Deployment:**  Vercel

---

## .env variables 

PORT = "3000" 
SALT_ROUNDS = "8"
DB_URL="mongodb+srv://admin:Memotito78@cluster0.t6noy0u.mongodb.net"
API_KEY="955435344855769"
API_SECRET="fmZQCTNm1QRTMZeBnqvKys1w3FQ"
CLOUD_NAME="dsixcalf3"
STRIPE_SECRET_KEY="sk_test_51RKeDzFvihyT1UjAeM3DOMJt5Mtfett0wutHTa0qZdZ24QYSUYWhXWKdACALNHUGMPvJCiF8oVXAwdF0ZT83VeIH00kxR59ALi"
ORDER_TOKEN="orderToken"
DEFAULT_SIGNATURE="defaultSignature"


---


## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo-name.git

# Navigate to frontend
cd frontend

# Install frontend dependencies
npm install

# Run the Angular app
ng serve
