const User = require("../models/userSchema")
const Course = require("../models/courseSchema")
const { uploadOnCloudinary, delateFromCloudinary } = require("../utils/cloudinary")
const EnrollCourse = require("../models/enrolledSchema")


const editProfile = async (req, res) => {
    try {
        const loggedInUser = req.user
        const AllowedEdits = ['name', 'age', 'gender', 'avatar']

        const isEditAllowed = Object.keys(req.body).every(field => AllowedEdits.includes(field))
        const isFieldEmpty = Array.from(req.body).some(field => field.trim === "")

        if (isFieldEmpty) return res.status(400).json({ message: "invalid input field." })
        if (!isEditAllowed) return res.status(401).json({ message: "invalid input field." })

        if (req.files) {
            const avatarLocalPath = req.files.avatar[0].path
            const { publicId } = req.body
            if (publicId) await delateFromCloudinary(publicId)

            const { url, fileId } = await uploadOnCloudinary(avatarLocalPath)
            loggedInUser.avatar = url
            loggedInUser.fileId = fileId
        }

        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key])
        await loggedInUser.save()
        res.status(200).json({ message: "Profile updated Successfully.", user: loggedInUser })
    } catch (error) {
        console.log(error.message)
    }
}

const myCourses = async (req, res) => {
    try {
        const userId = req.user._id;

        const courses = await EnrollCourse.find({ userId });

        return res.status(200).json({ courses });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Unable to find courses" });
    }
};


const buyCourse = async (req, res) => {
    try {
        const { courseId, userId } = req.params
        const user = await User.findById({ _id: userId })
        const course = await Course.findById({ _id: courseId })

        if (!user) return res.status(401).json({ message: "Invalid userId" })
        if (!course) return res.status(401).json({ message: "No course Found" })

        const isAlreayEnrolled = await EnrollCourse.find({ $and: [{ userId }, { courseId }] })
        if (isAlreayEnrolled.length > 0) return res.status(401).json({ message: "you have already enrolled." })

        const { amount, instructor, name, avatar } = course
        const enrolledCourse = await EnrollCourse.create({ courseId, amount, instructor, userId, courseName: name, avatar })

        res.status(200).json({ message: "Enrolled Successfully", enrolledCourse })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "failed to buy course." })
    }
}


const allCourses = async (req, res) => {
    try {
        const { limitReq } = req.query
        const totalCourses = await Course.countDocuments()

        let limit = limitReq || 10
        if (limitReq > 12) limit = 10

        const totalPages = Math.ceil(totalCourses / limit)
        const skip = (totalPages - 1) * limit

        const course = await Course.find({}).skip(skip).limit(limit)
        res.status(200).json({ course })

    } catch (error) {
        res.status(500).json({ message: "failed to load Courses.", data: error.message })
    }
}

module.exports = { editProfile, myCourses, buyCourse, allCourses }