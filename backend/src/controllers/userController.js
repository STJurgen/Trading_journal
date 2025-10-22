const User = require('../models/User');
const Trade = require('../models/Trade');
const calculatePnL = require('../utils/calculatePnL');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updated = await User.updateProfile(req.user.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: updated.id, email: updated.email, name: updated.name, role: updated.role });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const trades = await Trade.findAllByUser(req.user.id);
    const pnlValues = trades
      .map((trade) => calculatePnL(trade))
      .filter((value) => typeof value === 'number');
    const totalPnL = pnlValues.reduce((acc, curr) => acc + curr, 0);
    const winCount = pnlValues.filter((value) => value > 0).length;
    const lossCount = pnlValues.filter((value) => value < 0).length;
    const winRate = pnlValues.length ? Math.round((winCount / pnlValues.length) * 100) : 0;

    res.json({
      totalTrades: trades.length,
      totalPnL,
      winRate,
      winCount,
      lossCount
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getStats
};
