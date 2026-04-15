const express = require('express');
const router = express.Router();
const t = require('../controllers/transactionController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

// LIBRARIAN ROUTES
router.post('/issue', auth, roleCheck(['Admin', 'Librarian']), t.issueBook);
router.post('/return', auth, roleCheck(['Admin', 'Librarian']), t.returnBook);
router.get('/active', auth, roleCheck(['Admin', 'Librarian']), t.getActiveIssues);
router.get('/overdue', auth, roleCheck(['Admin', 'Librarian']), t.getOverdue);
router.get('/pending', auth, roleCheck(['Admin', 'Librarian']), t.getPendingRequests);
router.put('/:issue_id/approve-issue', auth, roleCheck(['Admin', 'Librarian']), t.approveRequest);
router.put('/:issue_id/approve-return', auth, roleCheck(['Admin', 'Librarian']), t.approveReturn);

// STUDENT ROUTES
router.post('/request', auth, roleCheck(['Student']), t.requestBook);
router.put('/:issue_id/request-return', auth, roleCheck(['Student']), t.requestReturn);
router.get('/my-books', auth, roleCheck(['Student']), t.getMyBooks);

module.exports = router;
