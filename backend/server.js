const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose=require('mongoose');
const colors=require('colors');
const userRoutes=require('./routes/userRoutes')
const {notFound,errorHandler}=require('./middlewares/errorHandler')
const app = express();
app.use(express.json());
const path = require("path");
const fs = require("fs");
//to accpet json data
app.use(cors());
app.use(bodyParser.json());
const questionRoutes = require("./routes/questionRoutes");



const connectDB=async()=>{
    try{
        console.log("Attempting to connect to MongoDB...");
        const con=await mongoose.connect(process.env.MONGO_URL,{
        });
        console.log(`Database connected: ${con.connection.host}`.cyan.underline);
       
    }catch(err){
        console.log(`Database connection error: , ${err.message}`.red.bold);
        console.log(err);
        process.exit(1);
    }
}
connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.use('/api/user',userRoutes)

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

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`.yellow.bold);
});
