import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import QuizQuestion from "./QuizQuestion.js";

const QuizAnswer = sequelize.define(
    "QuizAnswer",
    {
        quiz_answer_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        questions_quiz_question_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: QuizQuestion,
                key: "quiz_question_id",
            },
        },
        answer: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        tableName: "Quiz_answers",
    }
);

// Define association
QuizAnswer.belongsTo(QuizQuestion, {
    foreignKey: "questions_quiz_question_id",
    as: "question",
});
QuizQuestion.hasMany(QuizAnswer, {
    foreignKey: "questions_quiz_question_id",
    as: "answers",
});

export default QuizAnswer;
