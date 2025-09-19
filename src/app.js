const express = require('express')
const cookiesParser = require('cookie-parser')
const { connectDB } = require("./config/config")
const authRouter = require('./routes/auth.Route.js')
const courseRouter = require("./routes/course.Route.js")
const profileRouter = require("./routes/profile.Route.js")

require('dotenv').config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true })); 
app.use(cookiesParser())


const PORT = process.env.PORT || 8000

app.use("/api/v1", authRouter)
app.use("/api/v1", courseRouter)
app.use("/api/v1", profileRouter)

app.listen(PORT, async () => {
    try {
        if (await connectDB()) {
            console.log(`App is listing or PORT: ${PORT}`)
        }
    } catch (error) {
        console.log(error.message)
    }
})