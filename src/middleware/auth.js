const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token is not valid!!!!");
    }

    const decodedObj = await jwt.verify(token, "DEV@Tinder$798");
 
    const { _id } = decodedObj;
   
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR1234: " + err.message);
  }
};

//  const userAuth =  (req,res,next) => {
//     console.log("Admin auth is getting checked !!");
//     const token = "xyz";
//     const isAdminAuthorized = token === "xyz";
//     if(!isAdminAuthorized) {
//        res.status(401).send("Unauthorized request");
//     } else {
//         next();
//     }
// };

module.exports = {
  userAuth,
};
