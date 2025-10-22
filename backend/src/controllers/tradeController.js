const Trade = require('../models/Trade');
const Note = require('../models/Note');
const calculatePnL = require('../utils/calculatePnL');

const listTrades = async (req, res, next) => {
  try {
    const trades = await Trade.findAllByUser(req.user.id);
    const enriched = trades.map((trade) => ({
      ...trade,
      pnl: calculatePnL(trade)
    }));
    res.json(enriched);
  } catch (error) {
    next(error);
  }
};

const getTrade = async (req, res, next) => {
  try {
    const trade = await Trade.findById(req.params.id, req.user.id);
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    const notes = await Note.findAllByTrade(trade.id, req.user.id);
    res.json({ ...trade, pnl: calculatePnL(trade), notes });
  } catch (error) {
    next(error);
  }
};

const createTrade = async (req, res, next) => {
  try {
    const trade = await Trade.create(req.user.id, req.body);
    res.status(201).json({ ...trade, pnl: calculatePnL(trade) });
  } catch (error) {
    next(error);
  }
};

const updateTrade = async (req, res, next) => {
  try {
    const trade = await Trade.update(req.params.id, req.user.id, req.body);
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    res.json({ ...trade, pnl: calculatePnL(trade) });
  } catch (error) {
    next(error);
  }
};

const deleteTrade = async (req, res, next) => {
  try {
    await Trade.remove(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listTrades,
  getTrade,
  createTrade,
  updateTrade,
  deleteTrade
};
