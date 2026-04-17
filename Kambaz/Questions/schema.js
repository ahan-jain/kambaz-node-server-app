import mongoose from "mongoose";

const choiceSchema = new mongoose.Schema(
  { _id: String, text: String, isCorrect: { type: Boolean, default: false } },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: String,
    title: { type: String, default: "New Question" },
    type: { type: String, default: "MULTIPLE_CHOICE" },
    points: { type: Number, default: 1 },
    question: { type: String, default: "" },
    choices: [choiceSchema],
    correctAnswer: { type: String, default: "True" },
    possibleAnswers: [String],
  },
  { collection: "questions" }
);
export default questionSchema;
