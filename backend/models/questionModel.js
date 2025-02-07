
const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  QuestionNumber: { type: String, required: true },
  Question: { type: String, required: true },
  Options: {
    type: Map, 
    of: String, 
    required: true,
  },
  answer: { type: String, required: true },
  image_q: { type: String, required: false },
  image_o: { type: String, required: false },
  Unit: { type: String, required: true },
  Topic: { type: String, required: true },
  Sub_topic: { type: String, required: false },

  
});

const Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;
