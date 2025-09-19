const mongoose = require("mongoose")

const enrolledSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    instructor: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    }
}, { timestamps: true })



module.exports = mongoose.model("EnrolledCourse", enrolledSchema)