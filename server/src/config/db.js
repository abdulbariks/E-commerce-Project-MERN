const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");

const connectDB = async(options = {})=>{
    try {
        await mongoose.connect(mongodbURL, options)
        console.log("DB is Connected")

        mongoose.connection.on('error', (error)=>{
            console.error('DB Connection error:', error)
        })
        
    } catch (error) {
        console.error('Could not Connect to DB:', error.toString());
    }
}


module.exports ={connectDB};