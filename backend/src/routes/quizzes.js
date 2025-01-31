import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import Quiz from "../models/Quiz.js";
import Category from "../models/Category.js";
import QuizCategory from "../models/QuizCategory.js";
import QuizQuestion from "../models/QuizQuestion.js";
import QuizAnswer from "../models/QuizAnswer.js";
import QuizResult from "../models/QuizResult.js";
import QuizAnswerDetail from "../models/QuizAnswerDetail.js";
import QuizHistory from "../models/QuizHistory.js";
import sequelize from "../config/database.js";
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

// New route to create a complete quiz
router.post("/complete", authenticateToken, async (req, res) => {
    let { name, description, img_url, categories, results, questions } =
        req.body;
    name = req.body.title;
    const t = await sequelize.transaction();

    try {
        // Create quiz
        const quiz = await Quiz.create(
            { name, description, img_url, user_id: req.user.userId },
            { transaction: t }
        );

        console.log("Quiz created:", quiz.quiz_id);

        // Create categories and quiz-category associations
        for (const category of categories) {
            const [categoryRecord] = await Category.findOrCreate({
                where: { category },
                transaction: t,
            });
            console.log("Category created:", categoryRecord);
            await QuizCategory.create(
                {
                    Quizzes_quiz_id: quiz.quiz_id,
                    Categories_category_id: categoryRecord.category_id,
                },
                { transaction: t }
            );
        }

        // Create results
        const createdResults = await Promise.all(
            results.map((result) =>
                QuizResult.create(
                    {
                        quiz_id: quiz.quiz_id,
                        title: result.title,
                        description: result.description,
                        img_url: result.img_url,
                    },
                    { transaction: t }
                )
            )
        );

        // Create questions, answers, and answer details
        for (const question of questions) {
            const createdQuestion = await QuizQuestion.create(
                {
                    quiz_id: quiz.quiz_id,
                    question: question.title,
                    question_type: "multiple_choice",
                    img_url: question.img_url,
                },
                { transaction: t }
            );

            for (const answer of question.answers) {
                const createdAnswer = await QuizAnswer.create(
                    {
                        questions_quiz_question_id:
                            createdQuestion.quiz_question_id,
                        answer: answer.text,
                    },
                    { transaction: t }
                );

                for (const [resTitle, points] of Object.entries(
                    answer.resultPoints
                )) {
                    let quiz_result_id_of_ans = createdResults.filter(
                        (result) => {
                            return result.title === resTitle;
                        }
                    )[0].quiz_result_id;
                    await QuizAnswerDetail.create(
                        {
                            quiz_answer_id: createdAnswer.quiz_answer_id,
                            quiz_result_id: quiz_result_id_of_ans,
                            points,
                        },
                        { transaction: t }
                    );
                }
            }
        }

        await t.commit();
        res.status(201).json({
            message: "Quiz created successfully",
            quiz_id: quiz.quiz_id,
        });
    } catch (error) {
        await t.rollback();
        console.error("Error creating quiz:", error);
        res.status(500).json({
            message: "Failed to create quiz",
            error: error.message,
        });
    }
});

router.post("/:id/submit", authenticateToken, async (req, res) => {
    const quizId = req.params.id;
    const userId = req.user.userId;
    const { answers } = req.body;

    const t = await sequelize.transaction();

    try {
        // Fetch the quiz with questions, answers, and results
        const quiz = await Quiz.findByPk(quizId, {
            include: [
                {
                    model: QuizQuestion,
                    include: [
                        {
                            model: QuizAnswer,
                            as: "answers",
                            include: [
                                {
                                    model: QuizAnswerDetail,
                                    as: "answerDetails",
                                },
                            ],
                        },
                    ],
                },
                {
                    model: QuizResult,
                },
            ],
            transaction: t,
        });

        console.log("Fetched quiz:", JSON.stringify(quiz, null, 2));
        if (!quiz || !quiz.QuizQuestions) {
            await t.rollback();
            return res
                .status(404)
                .json({ message: "Quiz or quiz questions not found" });
        }

        // Calculate results
        const results = {};
        let totalPoints = 0;

        for (const question of quiz.QuizQuestions) {
            const answerId = answers[question.quiz_question_id];
            if (!question.answers) {
                console.error(
                    `No answers found for question ${question.quiz_question_id}`
                );
                continue;
            }
            const selectedAnswer = question.answers.find(
                (a) => a.quiz_answer_id === answerId
            );
            if (selectedAnswer) {
                if (!selectedAnswer.answerDetails) {
                    console.error(
                        `No answer details found for answer ${selectedAnswer.quiz_answer_id}`
                    );
                    continue;
                }
                for (const detail of selectedAnswer.answerDetails) {
                    if (!results[detail.quiz_result_id]) {
                        results[detail.quiz_result_id] = 0;
                    }
                    results[detail.quiz_result_id] += detail.points;
                    totalPoints += detail.points;
                }
            }
        }

        // Determine the top result
        let topResultId = null;
        let topResultPoints = Number.NEGATIVE_INFINITY;

        for (const [resultId, points] of Object.entries(results)) {
            if (points > topResultPoints) {
                topResultId = Number.parseInt(resultId);
                topResultPoints = points;
            }
        }

        // Create quiz history entry
        const quizHistory = await QuizHistory.create(
            {
                user_id: userId,
                quiz_id: quizId,
                quiz_result_id: topResultId,
            },
            { transaction: t }
        );

        // Prepare the response
        const response = {
            quizHistoryId: quizHistory.quiz_history_id,
            totalPoints,
            results: Object.fromEntries(
                Object.entries(results).map(([resultId, points]) => [
                    resultId,
                    {
                        points,
                        percentage: (points / totalPoints) * 100,
                        isTopResult: Number.parseInt(resultId) === topResultId,
                    },
                ])
            ),
            topResult: quiz.QuizResults.find(
                (r) => r.quiz_result_id === topResultId
            ),
        };

        await t.commit();
        res.json(response);
    } catch (error) {
        await t.rollback();
        console.error("Error submitting quiz:", error);
        res.status(500).json({
            message: "Failed to submit quiz",
            error: error.message,
        });
    }
});

router.delete("/:id", authenticateToken, async (req, res) => {
    const t = await sequelize.transaction();

    try {
        // Check if the user is root
        const rootUser = await User.findOne({
            where: { email: "root@example.com" },
        });
        if (req.user.userId !== rootUser.user_id) {
            return res
                .status(403)
                .json({ message: "Access denied. Root privileges required." });
        }

        const quizId = req.params.id;

        // Find the quiz
        const quiz = await Quiz.findByPk(quizId);
        if (!quiz) {
            await t.rollback();
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Delete associated records
        await QuizCategory.destroy({
            where: { Quizzes_quiz_id: quizId },
            transaction: t,
        });
        await QuizHistory.destroy({
            where: { quiz_id: quizId },
            transaction: t,
        });
        await Review.destroy({ where: { quiz_id: quizId }, transaction: t });

        // Delete questions and their associated answers and answer details
        const questions = await QuizQuestion.findAll({
            where: { quiz_id: quizId },
        });
        for (const question of questions) {
            const answers = await QuizAnswer.findAll({
                where: {
                    questions_quiz_question_id: question.quiz_question_id,
                },
            });
            for (const answer of answers) {
                await QuizAnswerDetail.destroy({
                    where: { quiz_answer_id: answer.quiz_answer_id },
                    transaction: t,
                });
            }
            await QuizAnswer.destroy({
                where: {
                    questions_quiz_question_id: question.quiz_question_id,
                },
                transaction: t,
            });
        }
        await QuizQuestion.destroy({
            where: { quiz_id: quizId },
            transaction: t,
        });

        // Delete quiz results
        await QuizResult.destroy({
            where: { quiz_id: quizId },
            transaction: t,
        });

        // Finally, delete the quiz
        await quiz.destroy({ transaction: t });

        await t.commit();
        res.json({
            message: "Quiz and all associated data deleted successfully",
        });
    } catch (error) {
        await t.rollback();
        console.error("Error deleting quiz:", error);
        res.status(500).json({
            message: "Failed to delete quiz",
            error: error.message,
        });
    }
});

export default router;
