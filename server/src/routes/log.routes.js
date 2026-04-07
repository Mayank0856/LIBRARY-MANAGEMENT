const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Admin only logs
router.get('/', auth, roleCheck(['Admin']), logController.getLogs);

module.exports = router;
