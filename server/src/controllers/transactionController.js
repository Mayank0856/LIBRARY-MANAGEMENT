const { IssuedBook, Book, Fine, User } = require('../models');
const { Op } = require('sequelize');
const { logAction } = require('../utils/logger');

const FINE_PER_DAY = 5; // ₹5 per day

// Issue a book
exports.issueBook = async (req, res) => {
  try {
    const { book_id, student_id } = req.body;

    const book = await Book.findByPk(book_id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.available_copies <= 0) return res.status(400).json({ message: 'Book is out of stock' });

    const activeIssues = await IssuedBook.count({
      where: { student_id, status: ['Issued', 'Overdue'] }
    });
    if (activeIssues >= 3) return res.status(400).json({ message: 'Student has reached max limit of 3 books' });

    const due_date = new Date();
    due_date.setDate(due_date.getDate() + 14);

    const issue = await IssuedBook.create({
      book_id,
      student_id,
      issued_by: req.user.id,
      due_date
    });

    await book.decrement('available_copies');

    await logAction({
      user_id: req.user.id,
      user_name: req.user.name,
      action: 'BOOK_ISSUED',
      details: `Book ${book.title} issued to student ID: ${student_id}`,
      ip_address: req.ip
    });

    res.status(201).json({ message: 'Book issued successfully', issue });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Return a book
exports.returnBook = async (req, res) => {
  try {
    const { issue_id } = req.body;

    const issue = await IssuedBook.findByPk(issue_id, { include: [Book] });
    if (!issue) return res.status(404).json({ message: 'Issue record not found' });
    if (issue.status === 'Returned') return res.status(400).json({ message: 'Book already returned' });

    issue.status = 'Returned';
    issue.return_date = new Date();
    await issue.save();

    await issue.Book.increment('available_copies');

    // Auto-calculate and create fine if overdue
    let fine = null;
    if (new Date(issue.due_date) < new Date()) {
      const daysOverdue = Math.floor((new Date() - new Date(issue.due_date)) / 86400000);
      const amount = daysOverdue * FINE_PER_DAY;
      if (amount > 0) {
        fine = await Fine.create({
          issue_id: issue.id,
          student_id: issue.student_id,
          amount
        });
      }
    }

    await logAction({
      user_id: req.user.id,
      user_name: req.user.name,
      action: 'BOOK_RETURNED',
      details: `Book ${issue.Book.title} returned by student ID: ${issue.student_id}. Fine generated: ${fine ? fine.amount : 0}`,
      ip_address: req.ip
    });

    res.json({ message: 'Book returned successfully', fine: fine ? fine.amount : null });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all active issues
exports.getActiveIssues = async (req, res) => {
  try {
    const issues = await IssuedBook.findAll({
      where: { status: ['Issued', 'Overdue'] },
      include: [
        { model: Book, attributes: ['id', 'title', 'isbn'] },
        { model: User, as: 'Student', attributes: ['id', 'name', 'email', 'enrollment_no'] }
      ],
      order: [['due_date', 'ASC']]
    });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get overdue books
exports.getOverdue = async (req, res) => {
  try {
    const overdue = await IssuedBook.findAll({
      where: {
        status: 'Issued',
        due_date: { [Op.lt]: new Date() }
      },
      include: [
        { model: Book, attributes: ['id', 'title'] },
        { model: User, as: 'Student', attributes: ['id', 'name', 'email'] }
      ],
      order: [['due_date', 'ASC']]
    });
    res.json(overdue);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
