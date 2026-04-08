const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const auth = require('../middlewares/auth');

router.get('/stats', auth, getDashboardStats);

module.exports = router;
