import { Sequelize } from "sequelize";
import "dotenv/config";

// const sequelize = new Sequelize("Quizzler", "root", null, {
//     host: "localhost",
//     dialect: "sqlite",
//     storage: "./Quizzler.db",
// });

// const sequelize = new Sequelize(
//     process.env.MYSQL_DB,
//     process.env.MYSQL_LOGIN,
//     process.env.MYSQL_PASSWORD,
//     {
//         host: process.env.MYSQL_HOST,
//         port: 3306,
//         dialect: "mysql",
//     }
// );

// const sequelize = new Sequelize("kbulanda", "kbulanda", "4qh10z6wsL1SFX5P", {
//     logging: console.log,
//     host: "mysql.agh.edu.pl",
//     port: 3306,
//     dialect: "mysql",
// });

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
