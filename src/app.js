const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("Connection established successfully...");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777 .....");
    });
  })
  .catch(() => {
    console.error("Database cannot be connected....");
  });
