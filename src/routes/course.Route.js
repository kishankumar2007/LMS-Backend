const express = require("express")
const upload = require("../middlewares/multer.Middleware")
const { adminAuth, userAuth } = require("../middlewares/authMiddleware")
const { createCourse, editCourse, deleteCourse, getCourse,allCourses,adminUploadedCourses} = require("../controllers/course.Controller")
const { myCourses, buyCourse } = require("../controllers/user.Controller")

const router = express.Router()


router.post("/create-course", adminAuth, upload.fields([{
    name: "avatar",
    maxCount: 1,
}]), createCourse)

router.patch("/edit-course/:courseId", adminAuth, upload.fields([{
    name: "avatar",
    maxCount: 1
}]), editCourse)

router.get("/user/:userId/mycourses", userAuth, myCourses)

router.post("/user/:userId/:courseId/buy", userAuth, buyCourse)

router.post("/course/delete/:courseId", userAuth, deleteCourse)

router.get("/feed",userAuth, allCourses)

router.get("/courses/:courseId", userAuth, getCourse)

// Admin Routes starts from here...

router.get("/admin/courses",adminAuth, adminUploadedCourses)

module.exports = router