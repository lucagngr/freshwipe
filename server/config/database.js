const { Sequelize } = require('sequelize');
require('dotenv').config();

const isPostgres = process.env.DB_DIALECT === 'postgres';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || (isPostgres ? 5432 : 3306),
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
    dialectOptions: isPostgres
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      : {}
  }
);

module.exports = sequelize;
