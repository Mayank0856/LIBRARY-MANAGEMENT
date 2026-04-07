const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fine = sequelize.define('Fine', {
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Paid', 'Unpaid'),
    defaultValue: 'Unpaid'
  },
  paid_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = Fine;
