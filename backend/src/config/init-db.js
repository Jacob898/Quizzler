import sequelize from "./database.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import "dotenv/config";

// Import all models
import "../models/Quiz.js";
import "../models/QuizResult.js";
import "../models/QuizHistory.js";
import "../models/Review.js";
import "../models/Category.js";
import "../models/QuizCategory.js";
import "../models/UserFriend.js";

const initDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection has been established successfully.");

        // Sync all models
        await sequelize.sync({ alter: true });
        console.log("Database synchronized successfully.");

        // Check for root user
        let rootUser = await User.findOne({
            where: { email: "root@example.com" },
        });
        if (!rootUser) {
            rootUser = await User.create({
                email: "root@example.com",
                password: "Krakra5?",
            });
            console.log("Root user created.");

            // Create admin entry for root user
            await Admin.create({ user_id: rootUser.user_id });
            console.log("Root user added as admin.");
        }
    } catch (error) {
        console.error("Unable to initialize database:", error);
        process.exit(1);
    }
};

export default initDatabase;
