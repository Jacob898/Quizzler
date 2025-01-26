import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Quiz from "./Quiz.js";

const QuizQuestion = sequelize.define(
    "QuizQuestion",
    {
        quiz_question_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        quiz_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Quiz,
                key: "quiz_id",
            },
        },
        question: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        tableName: "Quiz_questions",
    }
);

// Define association
QuizQuestion.belongsTo(Quiz, { foreignKey: "quiz_id" });
Quiz.hasMany(QuizQuestion, { foreignKey: "quiz_id" });

export default QuizQuestion;
