const { IssuedBook, Book, Fine, User } = require('../models');
const { Op } = require('sequelize');
const { logAction } = require('../utils/logger');

const FINE_PER_DAY = 5;

exports.issueBook = async (req, res) => {
  try {
    const { book_id, student_id } = req.body;

    const book = await Book.findByPk(book_id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.available_copies <= 0) return res.status(400).json({ message: 'Book is out of stock' });

    const activeIssues = await IssuedBook.count({
      where: { student_id, status: ['Pending', 'Issued', 'Return Pending', 'Overdue'] }
    });
    if (activeIssues >= 3) return res.status(400).json({ message: 'Limit of 3 books reached' });

    const due_date = new Date();
    due_date.setDate(due_date.getDate() + 14);

    const issue = await IssuedBook.create({
      book_id, student_id, issued_by: req.user.id, due_date, status: 'Issued'
    });

    await book.decrement('available_copies');
    res.status(201).json({ message: 'Book issued successfully', issue });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// STUDENT: Request to borrow a book
exports.requestBook = async (req, res) => {
  try {
    const { book_id } = req.body;
    const student_id = req.user.id;

    const book = await Book.findByPk(book_id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.available_copies <= 0) return res.status(400).json({ message: 'Book is out of stock currently. Waitlist is not available right now.' });

    const activeCount = await IssuedBook.count({
      where: { student_id, status: ['Pending', 'Issued', 'Return Pending', 'Overdue'] }
    });
    if (activeCount >= 3) return res.status(400).json({ message: 'You have reached the maximum limit of 3 active books/requests.' });

    // Ensure student hasn't already requested this book
    const existing = await IssuedBook.findOne({
      where: { student_id, book_id, status: ['Pending', 'Issued', 'Return Pending'] }
    });
    if (existing) return res.status(400).json({ message: 'You already have this book active or requested.' });

    const request = await IssuedBook.create({
      book_id, student_id, status: 'Pending', due_date: null
    });
    
    // Decrease available copies immediately to reserve
    await book.decrement('available_copies');

    res.status(201).json({ message: 'Book requested successfully. Waiting for librarian approval.', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// LIBRARIAN: Approve request
exports.approveRequest = async (req, res) => {
  try {
    const { issue_id } = req.params;
    console.log(`[LIBRARIAN] Approving Request ID: ${issue_id}`);
    
    const issue = await IssuedBook.findByPk(issue_id, { include: [Book, { model: User, as: 'Student' }] });
    
    if (!issue) {
      console.error(`[LIBRARIAN] Request ${issue_id} not found`);
      return res.status(404).json({ message: 'Request not found' });
    }

    if (issue.status !== 'Pending') {
      console.error(`[LIBRARIAN] Request ${issue_id} is not in Pending status (current: ${issue.status})`);
      return res.status(400).json({ message: `Request is already ${issue.status}` });
    }

    const due_date = new Date();
    due_date.setDate(due_date.getDate() + 14);

    issue.status = 'Issued';
    issue.issue_date = new Date();
    issue.due_date = due_date;
    issue.issued_by = req.user.id;
    
    await issue.save();
    console.log(`[LIBRARIAN] Request ${issue_id} approved for Student: ${issue.Student?.name}`);

    res.json({ message: 'Request approved and Book Issued successfully', issue });
  } catch (error) {
    console.error(`[LIBRARIAN] Error approving request ${req.params.issue_id}:`, error);
    res.status(500).json({ message: 'Server error during approval', error: error.message });
  }
};

// STUDENT: Direct Return (One-click)
exports.requestReturn = async (req, res) => {
  try {
    const { issue_id } = req.params;
    const issue = await IssuedBook.findByPk(issue_id, { include: [Book] });
    
    if (!issue || (issue.status !== 'Issued' && issue.status !== 'Overdue')) {
      return res.status(404).json({ message: 'Active issue not found' });
    }

    if (issue.student_id !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    issue.status = 'Returned';
    issue.return_date = new Date();
    await issue.save();

    if (issue.Book) {
      await issue.Book.increment('available_copies');
    }

    // Auto-calculate fine if overdue
    let fineAmount = 0;
    if (new Date(issue.due_date) < new Date()) {
      const daysOverdue = Math.floor((new Date() - new Date(issue.due_date)) / 86400000);
      fineAmount = daysOverdue * FINE_PER_DAY;
      if (fineAmount > 0) {
        await Fine.create({ issue_id: issue.id, student_id: issue.student_id, amount: fineAmount });
      }
    }

    res.json({ 
      message: 'Book returned successfully!', 
      fine: fineAmount > 0 ? `A fine of ₹${fineAmount} was recorded.` : null 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// LIBRARIAN: Approve return
exports.approveReturn = async (req, res) => {
  try {
    const { issue_id } = req.params;
    const issue = await IssuedBook.findByPk(issue_id, { include: [Book] });
    if (!issue || issue.status !== 'Return Pending') return res.status(404).json({ message: 'Return pending not found' });

    issue.status = 'Returned';
    issue.return_date = new Date();
    await issue.save();

    await issue.Book.increment('available_copies');

    let fine = null;
    if (new Date(issue.due_date) < new Date()) {
      const daysOverdue = Math.floor((new Date() - new Date(issue.due_date)) / 86400000);
      const amount = daysOverdue * FINE_PER_DAY;
      if (amount > 0) {
        fine = await Fine.create({ issue_id: issue.id, student_id: issue.student_id, amount });
      }
    }

    res.json({ message: 'Return approved successfully', fine: fine ? fine.amount : null });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

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

    res.json({ message: 'Book returned successfully directly' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getActiveIssues = async (req, res) => {
  try {
    const issues = await IssuedBook.findAll({
      where: { status: ['Issued', 'Overdue'] },
      include: [
        { model: Book, attributes: ['id', 'title', 'isbn', 'cover_image_url'] },
        { model: User, as: 'Student', attributes: ['id', 'name', 'email', 'enrollment_no'] }
      ]
    });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await IssuedBook.findAll({
      where: { status: ['Pending', 'Return Pending'] },
      include: [
        { model: Book, attributes: ['id', 'title', 'isbn', 'cover_image_url'] },
        { model: User, as: 'Student', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'ASC']]
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// STUDENT: Get my active, pending, or returned books
exports.getMyBooks = async (req, res) => {
  try {
    const issues = await IssuedBook.findAll({
      where: { student_id: req.user.id },
      include: [
        { model: Book, attributes: ['id', 'title', 'isbn', 'cover_image_url', 'reader_url'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getOverdue = async (req, res) => {
  try {
    const overdue = await IssuedBook.findAll({
      where: { status: 'Issued', due_date: { [Op.lt]: new Date() } },
      include: [{ model: Book }, { model: User, as: 'Student' }]
    });
    res.json(overdue);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
