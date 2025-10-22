const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { getProfile, updateProfile, getStats } = require('../controllers/userController');

const router = express.Router();

router.use(authenticate);
router.get('/me', getProfile);
router.put('/me', updateProfile);
router.get('/stats', getStats);

module.exports = router;
