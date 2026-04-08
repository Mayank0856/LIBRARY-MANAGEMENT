const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.get('/', auth, roleCheck(['Admin', 'Librarian']), getAllUsers);
router.post('/', auth, roleCheck(['Admin']), createUser);
router.put('/:id', auth, updateUser); // Security logic now inside controller
router.delete('/:id', auth, roleCheck(['Admin']), deleteUser);

module.exports = router;

