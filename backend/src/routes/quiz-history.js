import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import QuizHistory from "../models/QuizHistory.js";
import Quiz from "../models/Quiz.js";
import QuizResult from "../models/QuizResult.js";
import Review from "../models/Review.js";
import { Op } from "sequelize";

const router = express.Router();

// Record quiz attempt
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { quiz_id, quiz_result_id } = req.body;
        const quizHistory = await QuizHistory.create({
            user_id: req.user.userId,
            quiz_id,
            quiz_result_id,
        });
        res.status(201).json(quizHistory);
    } catch (error) {
        res.status(400).json({
            message: "Failed to record quiz history",
            error: error.message,
        });
    }
});

// Get user's quiz history
router.get("/user", authenticateToken, async (req, res) => {
    try {
        const history = await QuizHistory.findAll({
            where: { user_id: req.user.userId },
            include: [
                {
                    model: Quiz,
                    attributes: ["name", "description"],
                },
                {
                    model: QuizResult,
                    attributes: ["title", "description"],
                },
            ],
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch quiz history",
            error: error.message,
        });
    }
});

// New route to get user's quiz results and reviews
router.get("/user-results/:user_id", authenticateToken, async (req, res) => {
    try {
        const userId = req.params.user_id || req.user.userId;

        const userResults = await QuizHistory.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Quiz,
                    attributes: ["quiz_id", "name", "description"],
                },
                {
                    model: QuizResult,
                    attributes: ["quiz_result_id", "title", "description"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        // Get all quiz_ids from the user's history
        const quizIds = userResults.map((result) => result.Quiz.quiz_id);

        // Fetch reviews for these quizzes by the user
        const reviews = await Review.findAll({
            where: {
                user_id: userId,
                quiz_id: {
                    [Op.in]: quizIds,
                },
            },
            attributes: ["quiz_id", "stars", "comment"],
        });

        // Create a map of quiz_id to review for easy lookup
        const reviewMap = reviews.reduce((acc, review) => {
            acc[review.quiz_id] = review;
            return acc;
        }, {});

        // Combine quiz results with reviews
        const combinedResults = userResults.map((result) => ({
            quiz_history_id: result.quiz_history_id,
            quiz: result.Quiz,
            result: result.QuizResult,
            review: reviewMap[result.Quiz.quiz_id] || null,
            takenAt: result.createdAt,
        }));

        res.json(combinedResults);
    } catch (error) {
        console.error("Error fetching user results:", error);
        res.status(500).json({
            message: "Failed to fetch user results and reviews",
            error: error.message,
        });
    }
});

export default router;
