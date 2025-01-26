import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import QuizQuestion from "../models/QuizQuestion.js";
import Quiz from "../models/Quiz.js";

const router = express.Router();

// Create a new quiz question
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { quiz_id, question, points } = req.body;
        const quizQuestion = await QuizQuestion.create({
            quiz_id,
            question,
            points,
        });
        res.status(201).json(quizQuestion);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create quiz question",
            error: error.message,
        });
    }
});

// Get all questions for a specific quiz
router.get("/quiz/:quizId", async (req, res) => {
    try {
        const questions = await QuizQuestion.findAll({
            where: { quiz_id: req.params.quizId },
            include: [{ model: Quiz, attributes: ["name"] }],
        });
        res.json(questions);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch quiz questions",
            error: error.message,
        });
    }
});

// Get a specific quiz question
router.get("/:id", async (req, res) => {
    try {
        const question = await QuizQuestion.findByPk(req.params.id, {
            include: [{ model: Quiz, attributes: ["name"] }],
        });
        if (!question) {
            return res.status(404).json({ message: "Quiz question not found" });
        }
        res.json(question);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch quiz question",
            error: error.message,
        });
    }
});

// Update a quiz question
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const { question, question_type, points } = req.body;
        const quizQuestion = await QuizQuestion.findByPk(req.params.id);
        if (!quizQuestion) {
            return res.status(404).json({ message: "Quiz question not found" });
        }
        await quizQuestion.update({ question, question_type, points });
        res.json(quizQuestion);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update quiz question",
            error: error.message,
        });
    }
});

// Delete a quiz question
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const quizQuestion = await QuizQuestion.findByPk(req.params.id);
        if (!quizQuestion) {
            return res.status(404).json({ message: "Quiz question not found" });
        }
        await quizQuestion.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete quiz question",
            error: error.message,
        });
    }
});

export default router;
