import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Quiz from "./Quiz.js";

const QuizResult = sequelize.define("QuizResult", {
    quiz_result_id: {
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
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    img_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
});

// Define association
QuizResult.belongsTo(Quiz, { foreignKey: "quiz_id" });
Quiz.hasMany(QuizResult, { foreignKey: "quiz_id" });

export default QuizResult;
