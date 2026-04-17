import mongoose from "mongoose";
const quizSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, default: "Unnamed Quiz" },
    course: String,
    description: { type: String, default: "" },
    quizType: { type: String, default: "GRADED_QUIZ" },
    assignmentGroup: { type: String, default: "QUIZZES" },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: "IMMEDIATELY" },
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    assignTo: { type: String, default: "Everyone" },
    dueDate: Date,
    availableDate: Date,
    availableUntil: Date,
    published: { type: Boolean, default: false },
    points: { type: Number, default: 0 },
  },
  { collection: "quizzes" }
);
export default quizSchema;
