const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log("database connected...");
    } catch(e){
        console.log("database connection went a little bit not right ", e);
        process.exit(1);
    }
}

module.exports = connectDB;