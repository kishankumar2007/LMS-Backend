const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email already exits."]
    },
    password: {
        type: String,
        required: true,
        minLength: [6, "password must be of 6 characters"]

    },
    gender: {
        type: String,
        enum: ["male", "female", "gender"]
    },
    age: {
        type: String,
    },
    avatar: {
        type: String
    },
    interest: {
        type: [String],
    },
    role:{
        type: String,
        enum:["user","admin"],
        required: true
    }

}, { timestamps: true })



userSchema.pre("save", async function (next) {
    const user = this
    if (!user.isModified('password')) {
        return
    }
    const hashPassword = await bcrypt.hash(user.password, 10)
    user.password = hashPassword
    next()
})

userSchema.methods.getJWT = async function () {
    try {
        const user = this
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        return token
    } catch (error) {
        console.log(error.message)
    }
}


userSchema.methods.verifyPassword = async function (userPassword) {
    try {
        const user = this
        const isValid = await bcrypt.compare(userPassword, user.password)
        if (isValid) return isValid
        return false
    } catch (error) {
        console.log(error.message)
        return false
    }
}


module.exports = mongoose.model("User", userSchema)

