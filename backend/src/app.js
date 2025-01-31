import express from "express";
import cors from "cors";
import initDatabase from "./config/init-db.js";
import "dotenv/config";

// Import routes
import authRoutes from "./routes/auth.js";
import quizRoutes from "./routes/quizzes.js";
import reviewRoutes from "./routes/reviews.js";
import quizHistoryRoutes from "./routes/quiz-history.js";
import quizResultRoutes from "./routes/quiz-results.js";
import categoryRoutes from "./routes/categories.js";
import userRoutes from "./routes/users.js";
import adminRoutes from "./routes/admin.js";
import quizAnswerRoutes from "./routes/quiz-answers.js";
import quizQuestionRoutes from "./routes/quiz-questions.js";

const app = express();

app.use(cors());

// app.use(
//     cors({
//         origin: "http://localhost:5173/",
//     })
// );

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/quiz-history", quizHistoryRoutes);
app.use("/api/quiz-results", quizResultRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/quiz-answers", quizAnswerRoutes);
app.use("/api/quiz-questions", quizQuestionRoutes);

// Initialize database before starting the server
initDatabase()
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to initialize database:", error);
        process.exit(1);
    });

export default app;
