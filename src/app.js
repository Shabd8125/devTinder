require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "https://devtinderwebsite.netlify.app",
];


// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   }),
// );
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman, curl, mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
const PORT = process.env.PORT || 7777;
connectDB()
  .then(() => {
    console.log("Connection established successfully...");
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT} .....`);
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected!!", err);
  });

 
