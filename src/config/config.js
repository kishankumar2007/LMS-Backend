const mongoose = require('mongoose')
const { DBNAME } = require('../utils/constant')

const connectDB = async () => {
    try {

        await mongoose.connect(`${process.env.MONGO_URI}/${DBNAME}`)
        console.log('Database connected Successfully.')
        return true
    } catch (error) {
        console.log("DB connection failed: ", error.message)
        return false
    }
}


module.exports = {connectDB}