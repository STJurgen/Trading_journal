const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { listStrategies, getStrategy, createStrategy, updateStrategy, deleteStrategy } = require('../controllers/strategyController');

const router = express.Router();

router.use(authenticate);
router.get('/', listStrategies);
router.get('/:id', getStrategy);
router.post('/', createStrategy);
router.put('/:id', updateStrategy);
router.delete('/:id', deleteStrategy);

module.exports = router;
