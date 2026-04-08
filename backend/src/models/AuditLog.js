const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true // Default to null for guest actions
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false // e.g., 'CREATE_BOOK', 'ISSUE_BOOK'
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  updatedAt: false // Only created_at is needed
});

module.exports = AuditLog;
