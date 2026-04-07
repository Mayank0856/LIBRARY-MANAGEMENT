const express = require('express');
const router = express.Router();
const t = require('../controllers/transactionController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.post('/issue', auth, roleCheck(['Admin', 'Librarian']), t.issueBook);
router.post('/return', auth, roleCheck(['Admin', 'Librarian']), t.returnBook);
router.get('/active', auth, roleCheck(['Admin', 'Librarian']), t.getActiveIssues);
router.get('/overdue', auth, roleCheck(['Admin', 'Librarian']), t.getOverdue);

module.exports = router;
