const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    autherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    description: {
        type: String,
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
    isPublic: {
        type: Boolean,
        required: true,
        default: false
    },
    category: {
        type: String,
        enum: ['WebDevelopment', "DataScience", "MechineLearning", "All", "DSA",],
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Course', courseSchema)