const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: String,

    isPaid: {
        type: Boolean,
        default: true
    },

    topics: [
        {
            title: {
                type: String,
                required: true,
                trim: true
            },
            isFree: {
                type: Boolean,
                default: false
            },
            video: {
                url: String,
                fileId: String
            },
            attachments: [
                {
                    url: String,
                    fileId: String
                }
            ]
        }
    ]

}, { timestamps: true })



module.exports = mongoose.model("Chapter", ChapterSchema);