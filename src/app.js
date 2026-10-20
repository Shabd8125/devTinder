require("dotenv").config();
const express = require("express");
const multer = require("multer");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket");
const allowedOrigins = [
  "http://localhost:5173",
  "https://devtinderwebsite.netlify.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const PORT = process.env.PORT || 7777;

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Connection established successfully...");
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT} .....`);
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected!!", err);
  });

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload/photo", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const formData = new FormData();

    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });

    formData.append("file", blob, req.file.originalname);

    const response = await fetch("https://phototourl.com/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PhotoToURL error:", errorText);
      return res.status(response.status).json({
        error: "PhotoToURL upload failed",
      });
    }

    const data = await response.json();

    res.json({
      url: data.url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});
