const { Book, User, IssuedBook, Fine, Role } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalBooks = await Book.count();
    const availableBooks = await Book.sum('available_copies');
    const totalMembers = await User.count({
      include: [{ model: Role, where: { name: 'Student' } }]
    });

    const totalIssued = await IssuedBook.count({
      where: { status: ['Issued', 'Overdue'] }
    });

    const totalOverdue = await IssuedBook.count({
      where: {
        status: 'Issued',
        due_date: { [Op.lt]: new Date() }
      }
    });

    const returnedToday = await IssuedBook.count({
      where: {
        status: 'Returned',
        return_date: {
          [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });

    const finesResult = await Fine.findAll({
      where: { status: 'Paid' },
      attributes: ['amount']
    });
    const finesCollected = finesResult.reduce((sum, f) => sum + parseFloat(f.amount), 0);

    res.json({
      totalBooks,
      availableBooks,
      totalMembers,
      totalIssued,
      totalOverdue,
      returnedToday,
      finesCollected: finesCollected.toFixed(2)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};
