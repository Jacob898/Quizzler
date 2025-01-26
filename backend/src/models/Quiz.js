import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Quiz = sequelize.define("Quiz", {
    quiz_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    img_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "user_id",
        },
    },
});

Quiz.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Quiz, { foreignKey: "user_id" });

export default Quiz;
