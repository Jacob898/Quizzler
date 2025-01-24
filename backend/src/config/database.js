import { Sequelize } from "sequelize";

// const sequelize = new Sequelize("Quizzler", "root", null, {
//     host: "localhost",
//     dialect: "sqlite",
//     storage: "./Quizzler.db",
// });

const sequelize = new Sequelize({
    dialect: "sqlite",
    host: "localhost",
    storage: "./Quizzler.db",
    logging: false,
});

export default sequelize;
