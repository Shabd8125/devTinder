const mongoose = require("mongoose");
// const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
  firstName: {
    type: String,
    required: true,
    minLength:4,
    maxLength:50
  },
  lastName: {
    type: String,
     minLength:4,
    maxLength:50
  },
  emailId: {
    type: String,
    lowercase:true,
    required: true,
    unique: true,
    trim:true,
    // validate(value) {
    //   if(!validator.isEmail(value)) {
    //     throw new Error("Invalid email address " + value);
    //   }
    // }
  },
  password: {
    type: String,
    required: true,
    //  validate(value) {
    //   if(!validator.isStrongPassword(value)) {
    //     throw new Error("Enter a Strong Password " + value);
    //   }
    // }
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
    default:"https://kristalle.com/wp-content/uploads/2020/07/dummy-profile-pic-1.jpg",
    //  validate(value) {
    //   if(!validator.isURL(value)) {
    //     throw new Error("Invalid Photo URL " + value);
    //   }
    // }
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
