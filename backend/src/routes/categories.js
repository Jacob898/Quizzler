import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import Category from "../models/Category.js";
import Quiz from "../models/Quiz.js";

const router = express.Router();

// Create category
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { category, img_url } = req.body;
        const newCategory = await Category.create({ category, img_url });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create category",
            error: error.message,
        });
    }
});

// Get all categories
router.get("/", async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch categories",
            error: error.message,
        });
    }
});

// Get category by ID with its quizzes
router.get("/:id", async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include: [
                {
                    model: Quiz,
                    through: { attributes: [] }, // Exclude junction table attributes
                },
            ],
        });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch category",
            error: error.message,
        });
    }
});

// Get quizzes for a specific category
router.get("/:id/quizzes", async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findByPk(categoryId, {
            include: [
                {
                    model: Quiz,
                    through: { attributes: [] },
                    include: [
                        {
                            model: QuizResult,
                            attributes: ["title", "description"],
                        },
                    ],
                },
            ],
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json(category.Quizzes);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch quizzes for category",
            error: error.message,
        });
    }
});

// Update category
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const { category, img_url } = req.body;
        const existingCategory = await Category.findByPk(req.params.id);
        if (!existingCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        await existingCategory.update({ category, img_url });
        res.json(existingCategory);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update category",
            error: error.message,
        });
    }
});

// Delete category
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        await category.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete category",
            error: error.message,
        });
    }
});

export default router;
