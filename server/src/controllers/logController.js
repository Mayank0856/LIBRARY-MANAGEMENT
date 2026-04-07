const { AuditLog, User } = require('../models');

exports.getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action } = req.query;
    const where = {};
    if (action) where.action = action;

    const logs = await AuditLog.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    res.json({
      total: logs.count,
      pages: Math.ceil(logs.count / limit),
      data: logs.rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
