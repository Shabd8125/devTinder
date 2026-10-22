require("dotenv").config();
const express = require("express");
const multer = require("multer");
// const cloudinary = require("cloudinary").v2;
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

// app.post("/upload/photo", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         error: "No file uploaded",
//       });
//     }

//     if (!process.env.IMGBB_API_KEY) {
//       return res.status(500).json({
//         error: "ImgBB API key is missing",
//       });
//     }

//     const formData = new FormData();

//     const base64Image = req.file.buffer.toString("base64");

//     formData.append("image", base64Image);

//     const response = await fetch(
//       `https://api.imgbb.com/1/upload?key=${encodeURIComponent(
//         process.env.IMGBB_API_KEY
//       )}`,
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     const data = await response.json();

//     if (!response.ok || !data.success || !data.data?.url) {
//       console.error("ImgBB upload error:", data);

//       return res.status(502).json({
//         error: "Image upload failed",
//         details: data.error?.message || "ImgBB rejected the upload",
//       });
//     }

//     return res.json({
//       url: data.data.url,
//     });
//   } catch (error) {
//     console.error("Upload error:", error);

//     return res.status(500).json({
//       error: "Internal server error",
//     });
//   }
// });



// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// });


// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     if (!file.mimetype.startsWith("image/")) {
//       return cb(new Error("Only image files are allowed"));
//     }
//     cb(null, true);
//   },
// });


// const uploadToCloudinary = (buffer) =>
//   new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         folder: "devtinder",
//         resource_type: "image",
//         transformation: [
//           { width: 800, height: 800, crop: "limit" },
//           { quality: "auto", fetch_format: "auto" },
//         ],
//       },
//       (error, result) => (error ? reject(error) : resolve(result)),
//     );
//     stream.end(buffer);
//   });

// app.post("/upload/photo", (req, res) => {
//    console.log("CLOUDINARY ROUTE HIT");
//   upload.single("file")(req, res, async (err) => {
//     // Multer errors (file too large, wrong type)
//     if (err) {
//       return res.status(400).json({ error: err.message });
//     }

//     try {
//       if (!req.file) {
//         return res.status(400).json({ error: "No file uploaded" });
//       }

//       if (
//         !process.env.CLOUDINARY_CLOUD_NAME ||
//         !process.env.CLOUDINARY_API_KEY ||
//         !process.env.CLOUDINARY_API_SECRET
//       ) {
//         return res
//           .status(500)
//           .json({ error: "Cloudinary credentials are missing" });
//       }

//       const result = await uploadToCloudinary(req.file.buffer);

//       return res.json({ url: result.secure_url });
//     } catch (error) {
//       console.error("Upload error:", error);
//       return res.status(502).json({
//         error: "Image upload failed",
//         details: error.message,
//       });
//     }
//   });
// });


const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function uploadToImgBB(base64Image, retries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const body = new URLSearchParams();
      body.append("image", base64Image);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${encodeURIComponent(
          process.env.IMGBB_API_KEY
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
            Accept: "application/json",
          },
          body,
          signal: AbortSignal.timeout(20000),
        }
      );

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success && data.data?.url) {
        return data.data.url;
      }

      lastError = new Error(data?.error?.message || `HTTP ${response.status}`);

      // Only retry on blocks / rate limits / server errors
      const retryable = [403, 429].includes(response.status) || response.status >= 500;
      if (!retryable) break;
    } catch (err) {
      lastError = err;
    }

    await sleep(500 * 2 ** (attempt - 1)); // 500ms, 1s, 2s
  }

  throw lastError;
}

app.post("/upload/photo", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (!process.env.IMGBB_API_KEY) {
      return res.status(500).json({ error: "ImgBB API key is missing" });
    }

    const url = await uploadToImgBB(req.file.buffer.toString("base64"));
    return res.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(502).json({
      error: "Image upload failed",
      details: error.message,
    });
  }
});