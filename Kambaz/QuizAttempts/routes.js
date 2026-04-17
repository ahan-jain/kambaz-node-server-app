import QuizAttemptsDao from "./dao.js";
import QuestionsDao from "../Questions/dao.js";
import QuizzesDao from "../Quizzes/dao.js";

export default function QuizAttemptRoutes(app) {
  const dao = QuizAttemptsDao();
  const questionsDao = QuestionsDao();
  const quizzesDao = QuizzesDao();

  const findAttemptsForQuiz = async (req, res) => {
    const { quizId } = req.params;
    const attempts = await dao.findAttemptsForQuiz(quizId);
    res.json(attempts);
  };


  const findMyAttemptForQuiz = async (req, res) => {
    const { quizId } = req.params;
    if (!req.session["currentUser"]) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const userId = req.session["currentUser"]._id;
    const attempt = await dao.findLatestAttemptByUser(quizId, userId);
    res.json(attempt);
  };

  const findMyAttemptsForQuiz = async (req, res) => {
    const { quizId } = req.params;
    if (!req.session["currentUser"]) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const userId = req.session["currentUser"]._id;
    const attempts = await dao.findAttemptsByUser(quizId, userId);
    res.json(attempts);
  };

  const submitAttempt = async (req, res) => {
    const { quizId } = req.params;
    if (!req.session["currentUser"]) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const userId = req.session["currentUser"]._id;
    const quiz = await quizzesDao.findQuizById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const attemptCount = await dao.countAttemptsByUser(quizId, userId);
    if (quiz.multipleAttempts && attemptCount >= quiz.howManyAttempts) {
      return res.status(403).json({ message: "Maximum attempts reached" });
    }
    if (!quiz.multipleAttempts && attemptCount >= 1) {
      return res.status(403).json({ message: "Maximum attempts reached" });
    }

    const questions = await questionsDao.findQuestionsForQuiz(quizId);
    const { answers } = req.body;
    let score = 0;
    const gradedAnswers = answers.map((answer) => {
      const question = questions.find((q) => q._id === answer.question);
      if (!question) return { ...answer, isCorrect: false };
      let isCorrect = false;
      if (question.type === "MULTIPLE_CHOICE") {
        const correctIds = question.choices.filter((c) => c.isCorrect).map((c) => c._id);
        const selected = Array.isArray(answer.answer) ? answer.answer : (answer.answer ? [answer.answer] : []);
        isCorrect = correctIds.length === selected.length && correctIds.every((id) => selected.includes(id));
      } else if (question.type === "TRUE_FALSE") {
        isCorrect = String(answer.answer).toLowerCase() === String(question.correctAnswer).toLowerCase();
      } else if (question.type === "FILL_IN_BLANK") {
        const possibleAnswers = (question.possibleAnswers || []).map((a) => a.toLowerCase().trim());
        isCorrect = possibleAnswers.includes(String(answer.answer).toLowerCase().trim());
      }
      if (isCorrect) score += question.points || 0;
      return { ...answer, isCorrect };
    });
    const attemptNumber = attemptCount + 1;
    const newAttempt = await dao.createAttempt({
      quiz: quizId,
      user: userId,
      attemptNumber,
      score,
      submittedAt: new Date(),
      answers: gradedAnswers,
    });
    res.json(newAttempt);
  };

  app.get("/api/quizzes/:quizId/attempts", findAttemptsForQuiz);
  app.get("/api/quizzes/:quizId/attempts/my", findMyAttemptForQuiz);
  app.get("/api/quizzes/:quizId/attempts/mine", findMyAttemptsForQuiz);
  app.post("/api/quizzes/:quizId/attempts", submitAttempt);
}
