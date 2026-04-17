import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function QuizAttemptsDao() {
  function findAttemptsForQuiz(quizId) {
    return model.find({ quiz: quizId });
  }
  function findAttemptsByUser(quizId, userId) {
    return model.find({ quiz: quizId, user: userId }).sort({ attemptNumber: -1 });
  }
  function findLatestAttemptByUser(quizId, userId) {
    return model.findOne({ quiz: quizId, user: userId }).sort({ attemptNumber: -1 });
  }
  function countAttemptsByUser(quizId, userId) {
    return model.countDocuments({ quiz: quizId, user: userId });
  }
  function createAttempt(attempt) {
    const newAttempt = { ...attempt, _id: uuidv4() };
    return model.create(newAttempt);
  }
  return { findAttemptsForQuiz, findAttemptsByUser, findLatestAttemptByUser, countAttemptsByUser, createAttempt };
}
