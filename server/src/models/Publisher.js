const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Publisher = sequelize.define('Publisher', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = Publisher;
