import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import QuizAnswer from "./QuizAnswer.js";
import QuizResult from "./QuizResult.js";

const QuizAnswerDetail = sequelize.define(
    "QuizAnswerDetail",
    {
        quiz_answer_detail_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        quiz_answer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: QuizAnswer,
                key: "quiz_answer_id",
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
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        tableName: "Quiz_answer_details",
    }
);

// Define associations
QuizAnswerDetail.belongsTo(QuizAnswer, {
    foreignKey: "quiz_answer_id",
    as: "answer",
});
QuizAnswerDetail.belongsTo(QuizResult, {
    foreignKey: "quiz_result_id",
    as: "result",
});

QuizAnswer.hasMany(QuizAnswerDetail, {
    foreignKey: "quiz_answer_id",
    as: "answerDetails",
});
QuizResult.hasMany(QuizAnswerDetail, {
    foreignKey: "quiz_result_id",
    as: "answerDetails",
});

export default QuizAnswerDetail;
