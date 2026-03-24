const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
  firstName: {
    type: String,
    required: true,
    minLength:4,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    lowercase:true,
    required: true,
    unique: true,
    trim:true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min : 18,
    max:50,
  },
  gender: {
    type: String,
    validate(value) {
     if(!["male" , "female" , "others"].includes(value))  {
      throw new Error("Gender data is not valid");
     }
    },
  },
  photoUrl: {
    type: String,
    default:"https://kristalle.com/wp-content/uploads/2020/07/dummy-profile-pic-1.jpg"
  },
  about: {
    type: String,
    default: "This ia a default description of a user ",
  },
  skills: {
    type: [String],
  },
},
 { timestamps: true }

);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
