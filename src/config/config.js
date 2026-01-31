const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({
  path:"/"
})

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Database connected successfully")
    return true
  } catch (error) {
    console.error("DB connection failed:", error.message)
    process.exit(1)
  }
}

module.exports = { connectDB }
