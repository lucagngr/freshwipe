const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql', // par défaut MySQL, mais Render pourra utiliser postgres
    port: process.env.DB_PORT || 3306, // par défaut MySQL, mais Render utilisera 5432
    logging: false
  }
);

module.exports = sequelize;
