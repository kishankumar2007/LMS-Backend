const course = require('../models/courseSchema')
const { uploadOnCloudinary, delateFromCloudinary } = require("../utils/cloudinary")
const { validateCourseField } = require('../utils/validator')
const Chapter = require("../models/chapterSchema")
const { deleteChapterById } = require('../utils/constant')
const EnrollCourse = require("../models/enrolledSchema")


const createCourse = async (req, res) => {
    try {
        const { _id } = req.user

        const { name, description, instructor, amount, category } = req.body
        if ([name, description, instructor, amount].some(field => field === "")) {
            throw Error("All fields are required.")
        }

        const avatarLocalPath = req?.files?.avatar?.[0]?.path

        const avatarUrl = await uploadOnCloudinary(avatarLocalPath)

        const response = await course.create({ name, description, avatar: avatarUrl.url, instructor, amount, avatarId: avatarUrl.fileId, category, autherId: _id })


        if (response) res.status(200).json({ message: "Course created Successfully", course: response })
    } catch (error) {
        res.status(400).json({message: error.message})
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

        const data = req.body

        const isEditAllowed = await validateCourseField(data);
        if (!isEditAllowed) throw Error("invalid edit fields.");


        const avatarLocalPath = req.files?.avatar?.[0]?.path;
        let Course = await course.findOne({ _id: courseId });

        Object.keys(req.body).forEach(key => {
            Course[key] = req.body[key];
        });

        let avatarUrl = {};
        console.log(req.body)

        if (avatarLocalPath) {
            await delateFromCloudinary(data?.avatarId);
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
        const { avatarId } = await course.findOne({ _id: courseId })

        for (const chapter of chapters) {
            const res = await deleteChapterById(chapter._id)

            if (!res) throw Error("Failed to delete course")
        }

        await delateFromCloudinary(avatarId)
        const Course = await course.findByIdAndDelete({ _id: courseId })
        if (Course) {

            res.status(200).json({ message: "Course deleted succesfully." })
        } else {
            throw Error("Failed to delete course")
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ message: error.message })
    }
}

const allCourses = async (req, res) => {
    try {
        let { page = 1, limit = 10, category } = req.query;

        const loggedInUser = req.user;

        if (limit > 10) limit = 10;
        page = Number(page);

        const enrolledIds = await EnrollCourse
            .find({ userId: loggedInUser._id })
            .distinct("courseId");

        const filter = {
            _id: { $nin: enrolledIds }
        };

        if (category) {
            filter.category = category;
        }

        const totalCourses = await course.countDocuments(filter);
        const totalPages = Math.ceil(totalCourses / limit);
        const skip = (page - 1) * limit;

        const courses = await course
            .find(filter)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            courses,
            totalPages,
            currentPage: page
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to load courses",
            error: error.message
        });
    }
};


const adminUploadedCourses = async (req, res) => {
    try {
        const loggedInUser = req.user
        const response = await course.find({ autherId: loggedInUser._id })
        res.status(200).json({ message: "course fetched successfully", course: response })
    } catch (error) {
        res.status(400).json({ message: error.message })
        console.log(error.message)
    }
}
module.exports = { createCourse, editCourse, deleteCourse, getCourse, allCourses, adminUploadedCourses }