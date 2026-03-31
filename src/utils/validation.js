const validator = require("validator");
// const { validate } = require("../src/models/user");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password, photoUrl  } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password");
  }
   else if (!validator.isURL( photoUrl)) {
    throw new Error("Invalid Photo URL");
  }
};

module.exports = {
   validateSignUpData
}
