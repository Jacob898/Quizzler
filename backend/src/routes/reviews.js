import express from "express";
import { authenticateToken, isAdmin } from "../middleware/auth.js";
import Review from "../models/Review.js";
import User from "../models/User.js";

const router = express.Router();

// Create review
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { quiz_id, stars, comment } = req.body;
        const review = await Review.create({
            quiz_id,
            user_id: req.user.userId,
            stars,
            comment,
        });
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create review",
            error: error.message,
        });
    }
});

// Get reviews for a quiz
router.get("/quiz/:quizId", async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { quiz_id: req.params.quizId },
            include: [
                {
                    model: User,
                    attributes: ["email"], // Only include email, not password
                },
            ],
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch reviews",
            error: error.message,
        });
    }
});

// Update review
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const review = await Review.findOne({
            where: {
                quiz_review_id: req.params.id,
                user_id: req.user.userId,
            },
        });

        if (!review) {
            return res
                .status(404)
                .json({ message: "Review not found or unauthorized" });
        }

        const { stars, comment } = req.body;
        await review.update({ stars, comment });
        res.json(review);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update review",
            error: error.message,
        });
    }
});

// Delete review (admin or review owner)
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Check if user is admin or review owner
        const isOwner = review.user_id === req.user.userId;
        const admin = await Admin.findOne({
            where: { Users_user_id: req.user.userId },
        });

        if (!isOwner && !admin) {
            return res
                .status(403)
                .json({ message: "Unauthorized to delete this review" });
        }

        await review.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete review",
            error: error.message,
        });
    }
});

export default router;
