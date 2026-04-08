const { Book, User, IssuedBook, Fine, Role } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'Librarian';

    if (!isAdmin) {
      // Student specific stats
      const myIssued = await IssuedBook.count({
        where: { student_id: req.user.id, status: ['Issued', 'Overdue'] }
      });
      const myOverdue = await IssuedBook.count({
        where: { 
          student_id: req.user.id, 
          status: 'Issued',
          due_date: { [Op.lt]: new Date() }
        }
      });
      const myFines = await Fine.findAll({
        where: { student_id: req.user.id, status: 'Unpaid' },
        attributes: ['amount']
      });
      const totalFine = myFines.reduce((sum, f) => sum + parseFloat(f.amount), 0);

      return res.json({
        totalIssued: myIssued,
        totalOverdue: myOverdue,
        finesPending: totalFine.toFixed(2),
        totalBooks: await Book.count() // still useful for them
      });
    }

    // Admin/Librarian Global stats
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
