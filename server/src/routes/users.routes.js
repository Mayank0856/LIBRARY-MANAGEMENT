const express = require('express');
const router = express.Router();
const { getAllUsers, updateUser, deleteUser } = require('../controllers/userController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.get('/', auth, roleCheck(['Admin', 'Librarian']), getAllUsers);
router.put('/:id', auth, roleCheck(['Admin', 'Librarian']), updateUser);
router.delete('/:id', auth, roleCheck(['Admin']), deleteUser);

module.exports = router;
