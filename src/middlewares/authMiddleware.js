const User = require("../models/userSchema")
const jwt = require("jsonwebtoken")

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies

        if (!token) return res.status(400).json({ message: "Please sign first." })

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const _id = decoded?._id

        const user = await User.findById({ _id })
        if (!user) return res.status(400).json({ message: "session expired." })
        req.user = user
        next()
    } catch (error) {
        console.log(error.message)
    }
}

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies

        if (!token) return res.status(400).json({ message: "Please sign first." })

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const _id = decoded?._id

        const user = await User.findById({ _id })
        if (!user) return res.status(400).json({ message: "session expired." })
        if (user.role != "admin") res.status(401).json("Your are not authorized")
        req.user = user
        next()
    } catch (error) {
        console.log(error.message)
    }
}


module.exports = { userAuth, adminAuth }