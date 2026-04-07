const express = require('express');
const router = express.Router();
const c = require('../controllers/categoryController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.get('/', auth, c.getAll);
router.post('/', auth, roleCheck(['Admin', 'Librarian']), c.create);
router.put('/:id', auth, roleCheck(['Admin', 'Librarian']), c.update);
router.delete('/:id', auth, roleCheck(['Admin']), c.remove);

module.exports = router;
