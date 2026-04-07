const { Book, Category, Author, Publisher } = require('../models');
const { Op } = require('sequelize');

// Get all books with relations
exports.getAllBooks = async (req, res) => {
  try {
    const { search } = req.query;
    const where = search
      ? {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { isbn: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};
    const books = await Book.findAll({
      where,
      include: [Category, Author, Publisher]
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add new book
exports.addBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json({ message: 'Book created', book: newBook });
  } catch (error) {
    res.status(500).json({ message: 'Error adding book', error });
  }
};

// Update book
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    await book.update(req.body);
    res.json({ message: 'Book updated', book });
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error });
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    await book.destroy();
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error });
  }
};
