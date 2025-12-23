const course = require('../models/courseSchema')
const { uploadOnCloudinary, delateFromCloudinary } = require("../utils/cloudinary")
const { validateCourseField } = require('../utils/validator')
const Chapter = require("../models/chapterSchema")
const { deleteChapterById } = require('../utils/constant')


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

module.exports = { createCourse, editCourse, deleteCourse }