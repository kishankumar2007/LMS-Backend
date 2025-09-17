const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videos: {
        type: [String],
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    instructor: {
        type: String,
        requried: true
    },
    amount: {
        type: String,
        default: "Free"
    }
}, { timestamps: true })

module.exports = mongoose.model('Courses', courseSchema)