
const Question = require("../models/questionModel");

const getQuestionsByQuestionNumber = async (req, res) => {
  const questionNumber = req.params[0]; 

  try {
    const questions = await Question.find({
      QuestionNumber: { $regex: questionNumber, $options: "i" },
    });

    
    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found" });
    }

    res.status(200).json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching questions", error: err });
  }
};




const getQuestionsBySubtopic = async (req, res) => {
  try {
    // Get subtopics from the URL parameter
    const subtopics = req.params.subtopic.split(","); // Split by commas to support multiple subtopics

    // Find all questions where Sub_topic is in the list of subtopics (case-insensitive)
    const questions = await Question.find({
      Sub_topic: { $in: subtopics.map((sub) => new RegExp(sub, "i")) }, // case-insensitive search for each subtopic
    });

    if (questions.length === 0) {
      return res.status(404).json({
        message: `No questions found for subtopic(s): ${subtopics.join(", ")}`,
      });
    }

    return res.status(200).json({
      message: "Questions fetched successfully",
      questions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching questions by subtopic",
      error: error.message,
    });
  }
};



module.exports = {
  getQuestionsByQuestionNumber,
  getQuestionsBySubtopic,
};