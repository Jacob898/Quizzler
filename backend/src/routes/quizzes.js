import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import Quiz from "../models/Quiz.js";
import Category from "../models/Category.js";
import QuizCategory from "../models/QuizCategory.js";
import QuizQuestion from "../models/QuizQuestion.js";
import QuizAnswer from "../models/QuizAnswer.js";
import QuizResult from "../models/QuizResult.js";
import QuizAnswerDetail from "../models/QuizAnswerDetail.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
const router = express.Router();

// Create quiz with categories
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { name, description, categoryIds, img_url } = req.body;
        const quiz = await Quiz.create({
            name,
            description,
            img_url,
            user_id: req.user.userId,
        });

        if (categoryIds && categoryIds.length > 0) {
            await Promise.all(
                categoryIds.map((categoryId) =>
                    QuizCategory.create({
                        Quizzes_quiz_id: quiz.quiz_id,
                        Categories_category_id: categoryId,
                    })
                )
            );
        }

        const quizWithCategories = await Quiz.findByPk(quiz.quiz_id, {
            include: [
                {
                    model: Category,
                    through: { attributes: [] },
                },
            ],
        });

        res.status(201).json(quizWithCategories);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create quiz",
            error: error.message,
        });
    }
});

// Get all quizzes with their categories
router.get("/", async (req, res) => {
    try {
        const quizzes = await Quiz.findAll({
            include: [
                {
                    model: Category,
                    through: { attributes: [] },
                },
            ],
        });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch quizzes",
            error: error.message,
        });
    }
});

// Get specific quiz with categories
router.get("/:id", async (req, res) => {
    try {
        const quiz = await Quiz.findByPk(req.params.id, {
            include: [
                {
                    model: Category,
                    through: { attributes: [] },
                },
            ],
        });
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch quiz",
            error: error.message,
        });
    }
});

// Update quiz categories
router.put("/:id/categories", authenticateToken, async (req, res) => {
    try {
        const { categoryIds } = req.body;
        const quiz = await Quiz.findByPk(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Remove existing categories
        await QuizCategory.destroy({
            where: { Quizzes_quiz_id: quiz.quiz_id },
        });

        // Add new categories
        if (categoryIds && categoryIds.length > 0) {
            await Promise.all(
                categoryIds.map((categoryId) =>
                    QuizCategory.create({
                        Quizzes_quiz_id: quiz.quiz_id,
                        Categories_category_id: categoryId,
                    })
                )
            );
        }

        const updatedQuiz = await Quiz.findByPk(quiz.quiz_id, {
            include: [
                {
                    model: Category,
                    through: { attributes: [] },
                },
            ],
        });

        res.json(updatedQuiz);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update quiz categories",
            error: error.message,
        });
    }
});

// Update quiz
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const { name, description, img_url } = req.body;
        const quiz = await Quiz.findByPk(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        await quiz.update({ name, description, img_url });

        const updatedQuiz = await Quiz.findByPk(quiz.quiz_id, {
            include: [
                {
                    model: Category,
                    through: { attributes: [] },
                },
            ],
        });

        res.json(updatedQuiz);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update quiz",
            error: error.message,
        });
    }
});

// Endpoint to get quiz with all related data for solving
router.get("/:id/solve", async (req, res) => {
    try {
        const quiz = await Quiz.findByPk(req.params.id, {
            include: [
                {
                    model: QuizQuestion,
                    include: [
                        {
                            model: QuizAnswer,
                            as: "answers",
                            attributes: ["quiz_answer_id", "answer"], // Only include necessary answer fields
                        },
                    ],
                },
                {
                    model: QuizResult,
                },
            ],
        });

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Restructure the data as per the specified format
        const restructuredQuiz = {
            ...quiz.toJSON(),
            questions: quiz.QuizQuestions.map((question) => ({
                ...question.toJSON(),
                answers_for_question: question.answers,
            })),
            results: quiz.QuizResults,
        };

        // Remove the original nested structures
        delete restructuredQuiz.QuizQuestions;
        delete restructuredQuiz.QuizResults;

        res.json(restructuredQuiz);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch quiz data",
            error: error.message,
        });
    }
});

// New endpoint to get quiz with categories and reviews
router.get("/:id/details", authenticateToken, async (req, res) => {
    try {
        const quiz = await Quiz.findByPk(req.params.id, {
            include: [
                {
                    model: Category,
                    through: { attributes: [] }, // Exclude junction table attributes
                },
                {
                    model: Review,
                    limit: 10,
                    include: [
                        {
                            model: User,
                            attributes: ["user_id", "email", "img_url"], // Include only necessary user info
                        },
                    ],
                },
            ],
        });

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.json(quiz);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch quiz details",
            error: error.message,
        });
    }
});

export default router;
