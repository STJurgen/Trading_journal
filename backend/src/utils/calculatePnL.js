const calculatePnL = (trade) => {
  if (trade.exitPrice == null || trade.entryPrice == null || trade.quantity == null) {
    return null;
  }

  const directionMultiplier = trade.direction === 'short' ? -1 : 1;
  const difference = trade.exitPrice - trade.entryPrice;
  return Number((difference * trade.quantity * directionMultiplier).toFixed(2));
};

module.exports = calculatePnL;
