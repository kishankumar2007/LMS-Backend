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
    videoFileId: {
        type: [String],
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    avatarId: {
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
    },
    role:{
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        required: true,
        default: true
    },
    category:{
        type: String,
        enum: ['FullStack',"DataScience","MechineLearning","All","DSA",],
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Course', courseSchema)