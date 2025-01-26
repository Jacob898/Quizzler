import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Quiz from "./Quiz.js";
import Category from "./Category.js";

const QuizCategory = sequelize.define(
    "QuizCategory",
    {
        quiz_category_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Quizzes_quiz_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Quiz,
                key: "quiz_id",
            },
        },
        Categories_category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Category,
                key: "category_id",
            },
        },
    },
    {
        tableName: "Quiz_categories",
    }
);

// Set up many-to-many relationship
Quiz.belongsToMany(Category, {
    through: QuizCategory,
    foreignKey: "Quizzes_quiz_id",
    otherKey: "Categories_category_id",
});

Category.belongsToMany(Quiz, {
    through: QuizCategory,
    foreignKey: "Categories_category_id",
    otherKey: "Quizzes_quiz_id",
});

export default QuizCategory;
