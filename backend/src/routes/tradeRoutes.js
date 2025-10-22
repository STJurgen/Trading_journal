const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { listTrades, getTrade, createTrade, updateTrade, deleteTrade } = require('../controllers/tradeController');

const router = express.Router();

router.use(authenticate);
router.get('/', listTrades);
router.get('/:id', getTrade);
router.post('/', createTrade);
router.put('/:id', updateTrade);
router.delete('/:id', deleteTrade);

module.exports = router;
