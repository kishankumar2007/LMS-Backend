const course = require('../models/courseSchema')
const { uploadOnCloudinary, delateFromCloudinary } = require("../utils/cloudinary")

const createCourse = async (req, res) => {
    try {
        const { name, description, avatar, instructor, amount } = req.body
        const avatarLocalPath = req.files.avatar[0]?.path
        const contentFilePath = req.files.video
        let videoFileLocalPath = []
        let fileId = []
        const avatarUrl = await uploadOnCloudinary(avatarLocalPath)
        for (const file of contentFilePath) {
            const res = await uploadOnCloudinary(file.path)
            fileId.push(res.fileId)
            videoFileLocalPath.push(res.url)
        }
        const response = await course.create({ name, description, videos: videoFileLocalPath, avatar: avatarUrl.url, videoFileId: fileId, instructor, amount, avatarId: avatarUrl.fileId })
        if (response) res.status(200).json({ message: "Course created Successfully", course: response })
    } catch (error) {
        console.log(error.message)
        res.send(error.message)
    }
}

module.exports = { createCourse }