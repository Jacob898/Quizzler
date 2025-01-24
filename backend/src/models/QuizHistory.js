import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
import Quiz from "./Quiz.js";
import QuizResult from "./QuizResult.js";

const QuizHistory = sequelize.define(
    "QuizHistory",
    {
        quiz_history_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "user_id",
            },
        },
        quiz_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Quiz,
                key: "quiz_id",
            },
        },
        quiz_result_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: QuizResult,
                key: "quiz_result_id",
            },
        },
    },
    {
        tableName: "Quiz_history",
    }
);

// Define associations
QuizHistory.belongsTo(User, { foreignKey: "user_id" });
QuizHistory.belongsTo(Quiz, { foreignKey: "quiz_id" });
QuizHistory.belongsTo(QuizResult, { foreignKey: "quiz_result_id" });

export default QuizHistory;
