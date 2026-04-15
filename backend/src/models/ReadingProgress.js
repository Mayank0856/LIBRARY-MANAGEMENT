const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReadingProgress = sequelize.define('ReadingProgress', {
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  book_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  page_number: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
  total_pages: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  percent_complete: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
}, {
  indexes: [
    { unique: true, fields: ['student_id', 'book_id'] }
  ]
});

module.exports = ReadingProgress;
