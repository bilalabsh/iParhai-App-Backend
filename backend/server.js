const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const colors = require("colors");
const axios = require("axios");

const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();

// 🛠️ Middleware Setup
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.json());

// 🌍 MongoDB Connection
const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    const con = await mongoose.connect(process.env.MONGO_URL, {});
    console.log(`Database connected: ${con.connection.host}`.cyan.underline);
  } catch (err) {
    console.error(`Database connection error: ${err.message}`.red.bold);
    process.exit(1);
  }
};
connectDB();

// ✅ Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// 🛠️ User & Question Routes
app.use("/api/user", userRoutes);

// app.post('/api/import-questions', async (req, res) => {
//   const dataDirectory = path.join(__dirname, "data"); // Your directory containing JSON files

//   // Read all files in the directory
//   fs.readdir(dataDirectory, async (err, files) => {
//     if (err) {
//       return res
//         .status(500)
//         .json({ message: "Error reading the directory", error: err });
//     }

//     try {
//       // Filter out non-JSON files
//       const jsonFiles = files.filter((file) => file.endsWith(".json"));

//       if (jsonFiles.length === 0) {
//         return res
//           .status(400)
//           .json({ message: "No JSON files found in the directory" });
//       }

//       // Read and parse each JSON file
//       for (const file of jsonFiles) {
//         const filePath = path.join(dataDirectory, file);
//         const rawData = fs.readFileSync(filePath, "utf-8");
//         const questions = JSON.parse(rawData);

//         // Insert questions into MongoDB
//         await Question.insertMany(questions);
//       }

//       res
//         .status(200)
//         .json({ message: "Questions added successfully from files." });
//     } catch (error) {
//       console.error("Error processing files:", error);
//       res
//         .status(500)
//         .json({ message: "Error occurred while processing files", error });
//     }
//   });
// });

app.use(questionRoutes);

// 📽️ Video Streaming Route
app.get("/api/video", async (req, res) => {
  try {
    const videoUrl =
      "https://cdn.pixabay.com/video/2024/03/12/203923-922675870_large.mp4";
    const response = await axios({
      method: "GET",
      url: videoUrl,
      responseType: "stream",
    });

    res.setHeader("Content-Type", "video/mp4");

    response.data.pipe(res);
  } catch (error) {
    console.error("Error streaming video:", error.message);
    res.status(500).json({ error: "Failed to stream video" });
  }
});


app.use(notFound);
app.use(errorHandler);

// 🚀 Start Server
app.listen(5000, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:5000`);
});
