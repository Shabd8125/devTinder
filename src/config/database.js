const mongoose = require("mongoose");


const connectDB = async() => {
    await mongoose.connect("mongodb+srv://namastedev:Shabd%400112358@namastenode.eptkka4.mongodb.net/devTinder");
};


module.exports = connectDB;
