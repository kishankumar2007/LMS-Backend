const express = require("express")
const upload = require("../middlewares/multer.Middleware")
const { adminAuth, userAuth } = require("../middlewares/authMiddleware")
const { createCourse } = require("../controllers/course.Controller")
const { myCourses, buyCourse, allCourses } = require("../controllers/user.Controller")

const router = express.Router()


router.post("/create-course", adminAuth, upload.fields([{
    name: "avatar",
    maxCount: 1,
},
{
    name: "video",
    maxCount: 8
}]), createCourse)

router.get("/user/:userId/mycourses", userAuth, myCourses)

router.post("/user/:userId/:courseId/buy", userAuth, buyCourse)

router.get("/feed", allCourses)

module.exports = router