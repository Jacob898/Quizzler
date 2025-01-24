import express from "express";
import bcrypt from "bcrypt";
import { generateTokens } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.create({ email, password });
        const tokens = generateTokens(user.user_id);
        res.status(201).json({
            ...tokens,
            user: { id: user.user_id, email: user.email },
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

router.post("/refresh-token", async (req, res) => {
    const { refreshToken } = req.body;
    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const tokens = generateTokens(decoded.userId);
        res.json(tokens);
    } catch (error) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
});

export default router;
