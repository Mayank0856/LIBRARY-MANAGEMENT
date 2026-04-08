const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.get('/', auth, bookController.getAllBooks);
router.post('/', auth, roleCheck(['Admin', 'Librarian']), bookController.addBook);
router.put('/:id', auth, roleCheck(['Admin', 'Librarian']), bookController.updateBook);
router.delete('/:id', auth, roleCheck(['Admin', 'Librarian']), bookController.deleteBook);

module.exports = router;
