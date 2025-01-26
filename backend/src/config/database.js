import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(
    "postgresql://postgres.othcbdzkesbfpiyagcyf:gGGZSgKhfv4eYWto@aws-0-eu-central-1.pooler.supabase.com:5432/postgres",
    {
        logging: false,
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    }
);

export default sequelize;

// gGGZSgKhfv4eYWto