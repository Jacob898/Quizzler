import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Category = sequelize.define(
    "Category",
    {
        category_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        category: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        img_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: "Categories",
    }
);

export default Category;
