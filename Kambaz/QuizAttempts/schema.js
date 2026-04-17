import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: String,
    answer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: String,
    user: String,
    attemptNumber: { type: Number, default: 1 },
    score: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
    answers: [answerSchema],
  },
  { collection: "quizAttempts" }
);
export default quizAttemptSchema;
