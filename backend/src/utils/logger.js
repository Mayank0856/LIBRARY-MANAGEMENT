const { AuditLog } = require('../models');

/**
 * Log a system action to the AuditLog table
 * @param {Object} data { user_id, user_name, action, details, ip_address }
 */
const logAction = async ({ user_id, user_name, action, details, ip_address }) => {
  try {
    await AuditLog.create({
      user_id,
      user_name,
      action,
      details,
      ip_address
    });
  } catch (err) {
    console.error('Audit Logging failed:', err);
  }
};

module.exports = { logAction };
