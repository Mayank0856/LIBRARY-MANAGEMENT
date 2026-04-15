const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/auth');
const { getProgress, saveProgress } = require('../controllers/progressController');

router.get('/:bookId',  auth, getProgress);
router.post('/:bookId', auth, saveProgress);

module.exports = router;
