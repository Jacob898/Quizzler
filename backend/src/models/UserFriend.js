import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const UserFriend = sequelize.define(
    "UserFriend",
    {
        id: {
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
        friend_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "user_id",
            },
        },
    },
    {
        tableName: "Friends",
    }
);

User.belongsToMany(User, {
    as: "Friends",
    through: UserFriend,
    foreignKey: "user_id",
    otherKey: "friend_id",
});

export default UserFriend;
