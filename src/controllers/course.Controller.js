const course = require('../models/courseSchema')
const { uploadOnCloudinary, delateFromCloudinary } = require("../utils/cloudinary")
const { validateCourseField } = require('../utils/validator')
const Chapter = require("../models/chapterSchema")
const { deleteChapterById } = require('../utils/constant')
const EnrollCourse = require("../models/enrolledSchema")


const createCourse = async (req, res) => {
    try {

        const { name, description, avatar, instructor, amount, category } = req.body
        if ([name, description, avatar, instructor, amount].some(field => field?.trim() === "")) {
            throw Error("All fields are required.")
        }
        const avatarLocalPath = req?.files?.avatar[0]?.path


        const avatarUrl = await uploadOnCloudinary(avatarLocalPath)
        const response = await course.create({ name, description, avatar: avatarUrl.url, instructor, amount, avatarId: avatarUrl.fileId, category })
        if (response) res.status(200).json({ message: "Course created Successfully", course: response })
    } catch (error) {
        res.send(error.message)
    }
}


const getCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const Course = await course.findById({ _id: courseId })

        if (!Course) return res.status(404).json({ message: "Course not found." })

        res.status(200).json({ message: "Course fetched successfully", data: Course })
    } catch (error) {

        console.log(error.message)
        res.status(400).json({ message: error.message })

    }
}

const editCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const { avatarId } = req.body;

        const isEditAllowed = await validateCourseField(courseId, req.body);
        if (!isEditAllowed) throw Error("invalid edit fields.");


        const avatarLocalPath = req.files?.avatar?.[0]?.path;
        const videoFileLocalPath = req.files?.video || [];
        let Course = await course.findOne({ _id: courseId });


        Object.keys(req.body).forEach(key => {
            Course[key] = req.body[key];
        });

        let avatarUrl = {};

        if (avatarLocalPath) {
            await delateFromCloudinary(avatarId);
            avatarUrl = await uploadOnCloudinary(avatarLocalPath);
            Course.avatar = avatarUrl.url;
            Course.avatarId = avatarUrl.fileId;
        }

        const response = await Course.save();
        res.status(200).json({ message: "updated successfully", data: response });

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}


const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params

        const chapters = await Chapter.find({ courseId })

        for (const chapter of chapters) {
            await deleteChapterById(chapter._id)
        }

        const Course = await course.findByIdAndDelete({ _id: courseId })
        if (Course) {

            res.status(200).json({ message: "Course deleted succesfully." })
        } else {
            throw error
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ message: error.message })
    }
}

const allCourses = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query
        const loggedInUser = req.user
        const enrolledIds = await EnrollCourse.find({ userId: loggedInUser._id }).distinct("courseId")

        const totalCourses = await course.countDocuments({ _id: { $nin: enrolledIds } })

        if (limit > 10) limit = 10

        const totalPages = Math.ceil(totalCourses / limit)
        const skip = (page - 1) * limit

        const Course = await course.find({ _id: { $nin: enrolledIds } }).skip(skip).limit(limit)


        res.status(200).json({ course: Course, totalPages })

    } catch (error) {
        res.status(500).json({ message: "failed to load Courses.", data: error.message })
    }
}

module.exports = { createCourse, editCourse, deleteCourse, getCourse, allCourses }