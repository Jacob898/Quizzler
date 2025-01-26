import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import QuizAnswer from "../models/QuizAnswer.js";
import QuizAnswerDetail from "../models/QuizAnswerDetail.js";

const router = express.Router();

// Create a quiz answer
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { questions_quiz_question_id, answer } = req.body;
        const quizAnswer = await QuizAnswer.create({
            questions_quiz_question_id,
            answer,
        });
        res.status(201).json(quizAnswer);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create quiz answer",
            error: error.message,
        });
    }
});

// Get answers for a specific question
router.get("/question/:questionId", async (req, res) => {
    try {
        const answers = await QuizAnswer.findAll({
            where: { questions_quiz_question_id: req.params.questionId },
        });
        res.json(answers);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch answers",
            error: error.message,
        });
    }
});

// Create answer details (points for an answer)
router.post("/details", authenticateToken, async (req, res) => {
    try {
        const { quiz_answer_id, quiz_result_id, points } = req.body;
        const answerDetail = await QuizAnswerDetail.create({
            quiz_answer_id,
            quiz_result_id,
            points,
        });
        res.status(201).json(answerDetail);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create answer details",
            error: error.message,
        });
    }
});

// Get answer details for a specific result
router.get("/details/result/:resultId", async (req, res) => {
    try {
        const details = await QuizAnswerDetail.findAll({
            where: { quiz_result_id: req.params.resultId },
            include: [
                {
                    model: QuizAnswer,
                    as: "answer",
                    attributes: ["answer"],
                },
            ],
        });
        res.json(details);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch answer details",
            error: error.message,
        });
    }
});

// Update answer
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const { answer } = req.body;
        const quizAnswer = await QuizAnswer.findByPk(req.params.id);
        if (!quizAnswer) {
            return res.status(404).json({ message: "Answer not found" });
        }
        await quizAnswer.update({ answer });
        res.json(quizAnswer);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update answer",
            error: error.message,
        });
    }
});

// Update answer details
router.put("/details/:id", authenticateToken, async (req, res) => {
    try {
        const { points } = req.body;
        const answerDetail = await QuizAnswerDetail.findByPk(req.params.id);
        if (!answerDetail) {
            return res.status(404).json({ message: "Answer detail not found" });
        }
        await answerDetail.update({ points });
        res.json(answerDetail);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update answer details",
            error: error.message,
        });
    }
});

export default router;
