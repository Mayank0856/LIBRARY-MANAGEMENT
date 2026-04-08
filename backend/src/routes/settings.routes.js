const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.get('/', auth, settingController.getSettings);
router.post('/', auth, roleCheck(['Admin']), settingController.updateSettings);

module.exports = router;
