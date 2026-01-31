const express = require('express')
const cookiesParser = require('cookie-parser')
const { connectDB } = require("./config/config")
const authRouter = require('./routes/auth.Route.js')
const courseRouter = require("./routes/course.Route.js")
const profileRouter = require("./routes/profile.Route.js")
const chapterRouter = require("./routes/chapter.Route.js")
const cors = require('cors')

require('dotenv').config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookiesParser())

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))


const PORT = process.env.PORT || 8000

app.use("/api/v1", authRouter)
app.use("/api/v1", courseRouter)
app.use("/api/v1", chapterRouter)
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