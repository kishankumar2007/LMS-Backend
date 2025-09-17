const mongoose = require('mongoose')
const { DBNAME } = require('../constant')

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