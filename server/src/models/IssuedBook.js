const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IssuedBook = sequelize.define('IssuedBook', {
  issue_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  return_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Issued', 'Returned', 'Overdue'),
    defaultValue: 'Issued'
  }
});

module.exports = IssuedBook;
