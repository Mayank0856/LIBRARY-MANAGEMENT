const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  edition: {
    type: DataTypes.STRING,
    allowNull: true
  },
  language: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'English'
  },
  total_copies: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  available_copies: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cover_image_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  shelf_location: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Book;
