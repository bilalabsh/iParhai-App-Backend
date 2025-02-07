const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionControllers"); // import your controller

router.get(
  "/api/*",
  questionController.getQuestionsByQuestionNumber
);
router.get(
  "/questions/subtopic/:subtopic",
  questionController.getQuestionsBySubtopic 
);

module.exports = router;
