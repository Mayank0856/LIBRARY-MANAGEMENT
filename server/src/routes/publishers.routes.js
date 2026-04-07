const express = require('express');
const router = express.Router();
const p = require('../controllers/publisherController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.get('/', auth, p.getAll);
router.post('/', auth, roleCheck(['Admin', 'Librarian']), p.create);
router.put('/:id', auth, roleCheck(['Admin', 'Librarian']), p.update);
router.delete('/:id', auth, roleCheck(['Admin']), p.remove);

module.exports = router;
