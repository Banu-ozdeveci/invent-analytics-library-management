import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./library.sqlite",
  logging: false,
});

export default sequelize;
