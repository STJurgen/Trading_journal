jest.mock('../src/models/Trade', () => ({
  findAllByUser: jest.fn()
}));

jest.mock('../src/utils/calculatePnL', () => jest.fn(() => 25));

const Trade = require('../src/models/Trade');
const calculatePnL = require('../src/utils/calculatePnL');
const { listTrades } = require('../src/controllers/tradeController');

describe('Trade Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns a list of trades with calculated PnL', async () => {
    const trades = [
      { id: 1, quantity: 1, entryPrice: 100, exitPrice: 110, direction: 'long' },
      { id: 2, quantity: 2, entryPrice: 50, exitPrice: 45, direction: 'short' }
    ];
    Trade.findAllByUser.mockResolvedValue(trades);

    const req = { user: { id: 1 } };
    const res = { json: jest.fn() };
    const next = jest.fn();

    await listTrades(req, res, next);

    expect(Trade.findAllByUser).toHaveBeenCalledWith(1);
    expect(calculatePnL).toHaveBeenCalledTimes(trades.length);
    expect(res.json).toHaveBeenCalledWith([
      { ...trades[0], pnl: 25 },
      { ...trades[1], pnl: 25 }
    ]);
    expect(next).not.toHaveBeenCalled();
  });
});
