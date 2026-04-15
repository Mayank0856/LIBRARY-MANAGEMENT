const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.get('/', auth, roleCheck(['Admin']), roleController.getAllRoles);

module.exports = router;
