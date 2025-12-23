const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    isPaid: {
        type: String,
        required: true,
        enum: ["Yes", "No"],
        default: "Yes"
    },
    videos: {
        type: [{
            url: {
                type: String,
                required: true,
            },
            fileId: {
                type: String,
                required: true
            }
        }],
        required: true
    },
    attachments: {
       type: [{
            url: {
                type: String,
                required: true,
            },
            fileId: {
                type: String,
                required: true
            }
        }]
    }

}, { timestamps: true })


module.exports = mongoose.model("Chapter", ChapterSchema);