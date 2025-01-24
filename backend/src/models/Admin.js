import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Admin = sequelize.define("Admin", {
    admin_id: {
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
});

Admin.belongsTo(User, { foreignKey: "user_id" });

export default Admin;
