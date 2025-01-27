# CourseCloud - Online Course Marketplace

**CourseCloud** is an online course platform, similar to Udemy, designed for two key stakeholders:

- **Instructors**: Create and upload courses, track performance insights, and manage their content effectively.
- **Students**: Browse, purchase, and learn from courses uploaded by instructors.

This platform is built using the **MERN stack** and leverages additional technologies like **Nodemailer** for email functionality and **Cloudinary** for media storage.

---

## Features

### For Instructors:
- Create, manage, and upload courses.
- Track insights like enrollments and revenue.
- Upload course media (images, videos) via Cloudinary.

### For Students:
- Explore and purchase courses.
- Access purchased courses via a personalized dashboard.

### Additional Features:
- Email notifications (e.g., account creation, course purchase) via Nodemailer.
- Secure backend API with JWT-based authentication.
- Cloudinary integration for media storage.

---

## Technologies Used

- **Frontend**: React.js, Redux, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Media Storage**: Cloudinary
- **Email Service**: Nodemailer
- **Authentication**: JWT

---

## Installation Guide

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/rishabhk02/CourseCloud.git
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd ./Backend
   ```

2. Create a `.env` file in the backend directory and configure it using the `.env.example` file provided:
   ```bash
   cp .env.example .env
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the backend server:
   ```bash
   npm start
   # Or use the development mode:
   npm run dev
   ```

### 3. Frontend Setup

1. Navigate to the frontend directory from the project root:
   ```bash
   cd ./Frontend
   ```

2. Create a `.env` file in the frontend directory and configure it using the `.env.example` file provided:
   ```bash
   cp .env.example .env
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the frontend server:
   ```bash
   npm start
   ```

---

## .env Variables

### Backend `.env` Example
```env
MONGODB_URL=
PORT=
CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRETE_KEY=
IMAGE_GENERATOR_API=https://api.dicebear.com/5.x/initials/svg?seed=
JWT_SECRETE_KEY=
PASSWORD_RESET_URL=
IMAGE_UPLOAD_FOLDER_NAME=
INFO_EMAIL=
FRONTEND_URL=
MAIL_HOST=
MAIL_USER=
MAIL_PASS=
```

### Frontend `.env` Example

```env
REACT_APP_BACKEND_URL=http://localhost:PORT
```

---

## Usage

1. Start both the backend and frontend servers.
2. Open your browser and navigate to `http://localhost:3000`.
3. Register as an instructor or student and explore the platform.

---
