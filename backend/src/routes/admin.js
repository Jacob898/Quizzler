import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

const router = express.Router();

// Middleware to check if the user is root
const isRoot = async (req, res, next) => {
    const rootUser = await User.findOne({
        where: { email: "root@example.com" },
    });
    if (req.user.userId !== rootUser.user_id) {
        return res
            .status(403)
            .json({ message: "Access denied. Root privileges required." });
    }
    next();
};

// Add admin (root only)
router.post("/add", authenticateToken, isRoot, async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const [admin, created] = await Admin.findOrCreate({
            where: { Users_user_id: userId },
        });
        if (created) {
            res.status(201).json({ message: "Admin added successfully" });
        } else {
            res.status(200).json({ message: "User is already an admin" });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to add admin",
            error: error.message,
        });
    }
});

// Remove admin (root only)
router.delete(
    "/remove/:userId",
    authenticateToken,
    isRoot,
    async (req, res) => {
        try {
            const { userId } = req.params;
            const admin = await Admin.findOne({
                where: { Users_user_id: userId },
            });
            if (!admin) {
                return res.status(404).json({ message: "Admin not found" });
            }
            await admin.destroy();
            res.json({ message: "Admin removed successfully" });
        } catch (error) {
            res.status(500).json({
                message: "Failed to remove admin",
                error: error.message,
            });
        }
    }
);

router.get("/admins", authenticateToken, async (req, res) => {
    try {
        const admins = await Admin.findAll({
            include: [
                {
                    model: User,
                    attributes: ["email"],
                },
            ],
        });
        res.json(admins.map((admin) => admin.user_id));
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch admins",
            error: error.message,
        });
    }
});

export default router;
