const course = require('../models/courseSchema')
const { uploadOnCloudinary, delateFromCloudinary } = require("../utils/cloudinary")
const { validateCourseField } = require('../utils/validator')

const createCourse = async (req, res) => {
    try {

        const { name, description, avatar, instructor, amount, category } = req.body
        if ([name, description, avatar, instructor, amount].some(field => field?.trim() === "")) {
            throw Error("All fields are required.")
        }
        const avatarLocalPath = req?.files?.avatar[0]?.path
        const contentFilePath = req?.files?.video

        let videoFileLocalPath = []
        let fileId = []

        const avatarUrl = await uploadOnCloudinary(avatarLocalPath)
        for (const file of contentFilePath) {
            const res = await uploadOnCloudinary(file.path)
            fileId.push(res.fileId)
            videoFileLocalPath.push(res.url)
        }
        const response = await course.create({ name, description, videos: videoFileLocalPath, avatar: avatarUrl.url, videoFileId: fileId, instructor, amount, avatarId: avatarUrl.fileId, category })
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
        let videoFileUrl = [];
        let fileIds = [];

        if (avatarLocalPath) {
            await delateFromCloudinary(avatarId);
            avatarUrl = await uploadOnCloudinary(avatarLocalPath);
            Course.avatar = avatarUrl.url;
            Course.avatarId = avatarUrl.fileId;
        }

        if (videoFileLocalPath.length > 0) {
            for (const file of videoFileLocalPath) {
                console.log(file)
                const { fileId, url } = await uploadOnCloudinary(file.path);
                fileIds.push(fileId);
                videoFileUrl.push(url);
            }
            Course.videos = [...Course.videos, ...videoFileUrl];
            Course.videoFileId = [...Course.videoFileId, ...fileIds];
        }

        const response = await Course.save();
        res.status(200).json({ message: "updated successfully", data: response });

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const deleteFile = async (req, res) => {
    try {
        const { publicId, courseId } = req.body;

        const response = await delateFromCloudinary(publicId);
        if (!response) return res.status(404).json({ message: "File not found." })

        const Course = await course.findOne({ _id: courseId })
        if (!Course) throw Error("Course not found")

        const { videoFileId, videos } = Course
        const fileIndex = videoFileId.indexOf(publicId)

        videos.splice(fileIndex, 1)
        videoFileId.splice(fileIndex, 1)

        await Course.save()

        res.status(200).json({ message: "file deleted successfully." })

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}


const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params
        const Course = await course.findById({ _id: courseId })
        const { videoFileId } = Course

        for (const publicId of videoFileId) {
            await delateFromCloudinary(publicId)
        }
        
        await course.findByIdAndDelete({ _id: courseId })
        res.status(200).json({ message: "Course deleted succesfully." })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ message: error.message })
    }
}

module.exports = { createCourse, editCourse, deleteFile, deleteCourse }