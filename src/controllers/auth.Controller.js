const User = require("../models/userSchema")


const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        const data = await User.create({ name, email, password, role })
        res.status(200).json({ data, message: "Registered Successfully." })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ message: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) return res.status(400).json({ message: "email is not registed." })

        const isPasswordValid = await user.verifyPassword(password)
        if (!isPasswordValid) return res.status(400).json({ message: "Email or password is not valid." })

        const token = await user.getJWT(user._id)

        res.cookie("token", token, { https: true, secure: true, expires: new Date(Date.now() + 24 * 3600000) })
        res.status(200).json({ message: "Login success", user })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ message: error.message })
    }
}


const getUserProfile = async (req, res) => {
    try {
        const user = req.user
        res.status(200).json({ user })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
}


const logout = async (req, res) => {
    try {
        const user = req.user
        const token = user.getJWT()
        res.cookie("token", token, { https: true, secure: true, expires: new Date(Date.now()) })
        res.status(200).json({ message: "Logout Success" })
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ message: "Something went wrong!" })


    }
}

module.exports = { createUser, loginUser, getUserProfile, logout }