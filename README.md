
# 📚 LMS Backend (Learning Management System)

A **Node.js + Express + MongoDB** based backend for a Learning Management System (LMS).
Supports **user authentication**, **course management** and **media uploads (videos & PDFs)** using **Cloudinary**.

---

## 🚀 Features

* ✅ User Authentication (Register / Login / Logout)
* ✅ User Profile & Interests
* ✅ Course Creation, Update & Deletion
* ✅ Buy Course Flow
* ✅ Chapter Wise Video
  * Add Chapter
  * Edit Chapter
  * Delete Chapter
* ✅ Upload & Delete:
  * 🎬 Videos
  * 📄 PDF Attachments
* ✅ Cloudinary Integration (Manual upload)
* ✅ Secure & Clean Architecture (Controller → Service → Model)

---

## 🛠️ Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB, Mongoose
* **File Upload**: Multer (local storage)
* **Media Storage**: Cloudinary
* **Authentication**: JWT
* **API Testing**: Postman

---

## 📂 Project Structure

```
src/
│
├── controllers/
│   ├── auth.controller.js
│   ├── course.controller.js
│   └── chapter.controller.js
│
├── models/
│   ├── userSchema.js
│   ├── courseSchema.js
│   └── chapterSchema.js
│
├── routes/
│   ├── auth.routes.js
│   ├── course.routes.js
│   └── chapter.routes.js
│
├── utils/
│   ├── cloudinary.js
│   └── constant.js
│
├── middlewares/
│   ├── auth.middleware.js
│   └── multer.middleware.js
│
├── app.js
└── server.js
```

---

## 🔐 Environment Variables

Create a `.env` file in root:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/LMS
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

---

## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/kishankumar2007/LMS-Backend.git

# Install dependencies
npm install

# Start server
npm run dev
```

Server will run on:

```
http://localhost:3000
```

---

## 🔗 API Endpoints (Main)

### 🔑 Auth

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | `/api/v1/register` | Register user |
| POST   | `/api/v1/login`    | Login         |
| POST   | `/api/v1/logout`   | Logout        |

---

### 👤 User

| Method | Endpoint                | Description   |
| ------ | ----------------------- | ------------- |
| GET    | `/api/v1/profile`       | Get profile   |
| PATCH  | `/api/v1/profile/edit`  | Edit profile  |
| POST   | `/api/v1/user/interest` | Add interests |

---

### 📘 Course

| Method | Endpoint                             | Description   |
| ------ | ------------------------------------ | ------------- |
| POST   | `/api/v1/create-course`              | Create course |
| PATCH  | `/api/v1/edit-course/:courseId`      | Edit course   |
| POST   | `/api/v1/course/delete/:courseId`    | Delete course |
| GET    | `/api/v1/mycourses`                  | My courses    |
| GET    | `/api/v1/courses/:courseId`          | Get courses   |
| POST   | `/api/v1/user/:userId/:courseId/buy` | Buy course    |

---

### 📖 Chapter

| Method | Endpoint                                           | Description         |
| ------ | -------------------------------------------------- | ------------------- |
| GET    | `/api/v1/course/:courseId/chapters`                | Get All chapters    |
| POST   | `/api/v1/course/:courseId/chapter/create`          | Add chapter         |
| PATCH  | `/api/v1/course/chapter/:chapterId/edit`           | Edit chapter        |
| POST   | `/api/v1/course/chapter/:chapterId/:fileId/delete` | Delete chapter file |
| POST   | `/api/v1/course/:chapterId/delete`                 | Delete chapter      |

---

## ☁️ Cloudinary Usage

* **Videos** → `resource_type: "video"`
* **PDFs** → `resource_type: "raw"`
* Files are:

  1. Uploaded locally using Multer
  2. Uploaded to Cloudinary
  3. Deleted from local storage
  4. Stored in MongoDB with `url` & `fileId`

---

## 🔥 Future Improvements

* 🔐 Role-based access (Admin / Instructor / Student)
* 🎬 AI Recommandation
* 📊 Pagination & search
* 💳 Payment gateway integration

---

## 👨‍💻 Author

**Kishan Kumar**
📍 India

---

## ⭐ Support

If you like this project, give it a ⭐
For improvements or help — feel free to ask 😄

