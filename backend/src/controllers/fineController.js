const { Fine, IssuedBook, User, Book } = require('../models');
const { logAction } = require('../utils/logger');

// Get all fines
exports.getAllFines = async (req, res) => {
  try {
    const fines = await Fine.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        {
          model: IssuedBook,
          include: [{ model: Book, attributes: ['id', 'title'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(fines);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Mark fine as paid
exports.markPaid = async (req, res) => {
  try {
    const fine = await Fine.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['name'] }]
    });
    if (!fine) return res.status(404).json({ message: 'Fine not found' });
    
    fine.status = 'Paid';
    fine.paid_date = new Date();
    await fine.save();

    await logAction({
      user_id: req.user.id,
      user_name: req.user.name,
      action: 'FINE_PAID',
      details: `Fine of ₹${fine.amount} marked as paid for student: ${fine.User?.name}`,
      ip_address: req.ip
    });

    res.json({ message: 'Fine marked as paid' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

