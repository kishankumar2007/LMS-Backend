const express = require('express')
const cookiesParser = require('cookie-parser')
const { connectDB } = require("./config/config")
const authRouter = require('./routes/auth.Route.js')

require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cookiesParser())



const PORT = process.env.PORT || 8000

app.use("/api/v1", authRouter)


app.listen(PORT, async () => {
    try {
        if (await connectDB()) {
            console.log(`App is listing or PORT: ${PORT}`)
        }
    } catch (error) {
        console.log(error.message)
    }
})