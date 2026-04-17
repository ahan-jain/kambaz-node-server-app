import QuestionsDao from "./dao.js";
import QuizzesDao from "../Quizzes/dao.js";

export default function QuestionRoutes(app) {
  const dao = QuestionsDao();
  const quizzesDao = QuizzesDao();

  const findQuestionsForQuiz = async (req, res) => {
    const { quizId } = req.params;
    const questions = await dao.findQuestionsForQuiz(quizId);
    res.json(questions);
  };

  const createQuestionForQuiz = async (req, res) => {
    const { quizId } = req.params;
    const question = { ...req.body, quiz: quizId };
    const newQuestion = await dao.createQuestion(question);
    const questions = await dao.findQuestionsForQuiz(quizId);
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
    await quizzesDao.updateQuiz(quizId, { points: totalPoints });
    res.json(newQuestion);
  };

  const deleteQuestion = async (req, res) => {
    const { questionId } = req.params;
    const question = await dao.findQuestionById(questionId);
    await dao.deleteQuestion(questionId);
    if (question) {
      const questions = await dao.findQuestionsForQuiz(question.quiz);
      const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
      await quizzesDao.updateQuiz(question.quiz, { points: totalPoints });
    }
    res.send({ status: "OK" });
  };

  const updateQuestion = async (req, res) => {
    const { questionId } = req.params;
    const questionUpdates = req.body;
    await dao.updateQuestion(questionId, questionUpdates);
    const question = await dao.findQuestionById(questionId);
    if (question) {
      const questions = await dao.findQuestionsForQuiz(question.quiz);
      const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
      await quizzesDao.updateQuiz(question.quiz, { points: totalPoints });
    }
    res.send({ status: "OK" });
  };

  app.get("/api/quizzes/:quizId/questions", findQuestionsForQuiz);
  app.post("/api/quizzes/:quizId/questions", createQuestionForQuiz);
  app.delete("/api/questions/:questionId", deleteQuestion);
  app.put("/api/questions/:questionId", updateQuestion);
}
