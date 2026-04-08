const express = require('express');
const router = express.Router();
const a = require('../controllers/authorController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.get('/', auth, a.getAll);
router.post('/', auth, roleCheck(['Admin', 'Librarian']), a.create);
router.put('/:id', auth, roleCheck(['Admin', 'Librarian']), a.update);
router.delete('/:id', auth, roleCheck(['Admin']), a.remove);

module.exports = router;
