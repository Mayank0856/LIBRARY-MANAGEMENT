const { Sequelize } = require('sequelize');
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'mysql';
const config = {
  host: process.env.DB_HOST,
  dialect: dialect,
  logging: false, // Set to console.log to see SQL queries
};

if (dialect === 'sqlite') {
  config.storage = './database.sqlite';
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  config
);

module.exports = sequelize;
