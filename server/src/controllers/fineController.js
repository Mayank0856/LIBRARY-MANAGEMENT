const { Fine, IssuedBook, User, Book } = require('../models');

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
    const fine = await Fine.findByPk(req.params.id);
    if (!fine) return res.status(404).json({ message: 'Fine not found' });
    fine.status = 'Paid';
    fine.paid_date = new Date();
    await fine.save();
    res.json({ message: 'Fine marked as paid' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
