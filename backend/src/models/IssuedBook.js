const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IssuedBook = sequelize.define('IssuedBook', {
  issue_date: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  return_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Issued', 'Return Pending', 'Returned', 'Overdue'),
    defaultValue: 'Pending'
  }
});

module.exports = IssuedBook;
