import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import QuizResult from "../models/QuizResult.js";
import Quiz from "../models/Quiz.js";

const router = express.Router();

// Create a new quiz result
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { quiz_id, title, description } = req.body;
        const quizResult = await QuizResult.create({
            quiz_id,
            title,
            description,
        });
        res.status(201).json(quizResult);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create quiz result",
            error: error.message,
        });
    }
});

// Get all results for a specific quiz
router.get("/quiz/:quizId", async (req, res) => {
    try {
        const results = await QuizResult.findAll({
            where: { quiz_id: req.params.quizId },
            include: [{ model: Quiz, attributes: ["name"] }],
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch quiz results",
            error: error.message,
        });
    }
});

// Get a specific quiz result
router.get("/:id", async (req, res) => {
    try {
        const result = await QuizResult.findByPk(req.params.id, {
            include: [{ model: Quiz, attributes: ["name"] }],
        });
        if (!result) {
            return res.status(404).json({ message: "Quiz result not found" });
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch quiz result",
            error: error.message,
        });
    }
});

// Update a quiz result
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const { title, description } = req.body;
        const result = await QuizResult.findByPk(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Quiz result not found" });
        }
        await result.update({ title, description });
        res.json(result);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update quiz result",
            error: error.message,
        });
    }
});

// Delete a quiz result
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const result = await QuizResult.findByPk(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Quiz result not found" });
        }
        await result.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete quiz result",
            error: error.message,
        });
    }
});

export default router;
