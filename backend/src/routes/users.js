import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Get user profile
router.get("/profile/:user_id", authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(
            req.params.user_id || req.user.userId,
            {
                attributes: ["user_id", "email", "img_url"],
            }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message,
        });
    }
});

// Update user image_url
router.put("/image", authenticateToken, async (req, res) => {
    try {
        const { img_url } = req.body;
        const user = await User.findByPk(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.update({ img_url });

        res.json({
            message: "Profile image updated successfully",
            user: {
                id: user.user_id,
                img_url: user.img_url,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update profile image",
            error: error.message,
        });
    }
});

export default router;
