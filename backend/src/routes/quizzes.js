import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import Quiz from "../models/Quiz.js";

const router = express.Router();

// Create quiz (authenticated users)
router.post("/", authenticateToken, async (req, res) => {
    try {
        const quiz = await Quiz.create(req.body);
        res.status(201).json(quiz);
    } catch (error) {
        res.status(400).json({ message: "Failed to create quiz" });
    }
});

// Get all quizzes
router.get("/", async (req, res) => {
    try {
        const quizzes = await Quiz.findAll();
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch quizzes" });
    }
});

// Get specific quiz
router.get("/:id", async (req, res) => {
    try {
        const quiz = await Quiz.findByPk(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch quiz" });
    }
});

export default router;
