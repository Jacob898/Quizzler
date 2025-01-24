import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

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
});

export default Quiz;
