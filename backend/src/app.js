import express from "express";
import cors from "cors";
import sequelize from "./config/database.js";

import "./models/User.js";
import "./models/Quiz.js";
import "./models/QuizResult.js";
import "./models/QuizHistory.js";
import "./models/Review.js";

import authRoutes from "./routes/auth.js";
import quizRoutes from "./routes/quizzes.js";
import reviewRoutes from "./routes/reviews.js";
import quizHistoryRoutes from "./routes/quiz-history.js";
import quizResultRoutes from "./routes/quiz-results.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/quiz-history", quizHistoryRoutes);
app.use("/api/quiz-results", quizResultRoutes);

// Sync database
sequelize
    .sync({ alter: true })
    .then(() => {
        console.log("Database synchronized");
    })
    .catch((error) => {
        console.error("Error synchronizing database:", error);
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
