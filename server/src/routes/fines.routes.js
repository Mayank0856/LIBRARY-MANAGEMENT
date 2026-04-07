const express = require('express');
const router = express.Router();
const { getAllFines, markPaid } = require('../controllers/fineController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.get('/', auth, roleCheck(['Admin', 'Librarian']), getAllFines);
router.put('/:id/pay', auth, roleCheck(['Admin', 'Librarian']), markPaid);

module.exports = router;
