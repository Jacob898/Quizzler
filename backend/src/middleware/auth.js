import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
export const JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";

export const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
    return { accessToken, refreshToken };
};

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findOne({
            where: { Users_user_id: req.user.userId },
        });
        if (!admin) {
            return res.status(403).json({ message: "Admin access required" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};
