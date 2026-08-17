const mongoose = require("mongoose");
 const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async() => {
    // await mongoose.connect("mongodb+srv://namastedev:Shabd%400112358@namastenode.eptkka4.mongodb.net/devTinder");
     await mongoose.connect(process.env.MONGO_URI);
};


module.exports = connectDB;
