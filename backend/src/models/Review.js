import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
import Quiz from "./Quiz.js";

const Review = sequelize.define("Review", {
    quiz_review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "quiz_review_id",
    },
    quiz_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Quiz,
            key: "quiz_id",
        },
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "user_id",
        },
    },
    stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

// Define associations
Review.belongsTo(User, { foreignKey: "user_id" });
Review.belongsTo(Quiz, { foreignKey: "quiz_id" });
User.hasMany(Review, { foreignKey: "user_id" });
Quiz.hasMany(Review, { foreignKey: "quiz_id" });

export default Review;
