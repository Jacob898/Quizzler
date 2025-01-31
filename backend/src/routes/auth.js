import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateTokens, JWT_REFRESH_SECRET } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.create({ email, password });
        const tokens = generateTokens(user.user_id);
        res.status(201).json({
            ...tokens,
            // TODO: img_url is empty for now
            user: { id: user.user_id, email: user.email, img_url: "" },
        });
    } catch (error) {
        res.status(400).json({ message: "Registration failed" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const tokens = generateTokens(user.user_id);
        res.json({ ...tokens, user: { id: user.user_id, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
});

// router.post("/refresh-token", async (req, res) => {
//     const { refreshToken } = req.body;
//     try {
//         const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
//         const tokens = generateTokens(decoded.userId);
//         res.json(tokens);
//         console.log("Refresh token generated");
//     } catch (error) {
//         res.status(403).json({ message: "Invalid refresh token" });
//     }
// });

router.post("/refresh-token", async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newTokens = generateTokens(user.user_id);

        res.json(newTokens);
    } catch (error) {
        console.error("Error in refresh token:", error);
        if (error instanceof jwt.TokenExpiredError) {
            return res
                .status(403)
                .json({ message: "Refresh token has expired" });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
