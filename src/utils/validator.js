const User = require("../models/userSchema");

const validator = require("validator");

async function validateRegisterData({ name, email, password }) {
    if ([name, email, password].some(field => field.trim === "")) {
        throw Error("All fields are required.")
    }
    const isValidEmail = validator.isEmail(email)
    if (!isValidEmail) throw Error("Enter valid email.")

    const isPasswordValid = validator.isStrongPassword(password)
    if (!isPasswordValid) throw Error("Password found in leak database.")

    const user = await User.findOne({ email })

    if (user) throw Error("Email alreday present in database.")
    return true
}

async function validateCourseField(course) {
    const {name,description,instructor,amount} = course
    if ([name, description, instructor, amount].some(field => field.trim === "")) {
        throw Error("All fields are required.")
    }
    return true
}

module.exports = { validateRegisterData, validateCourseField }