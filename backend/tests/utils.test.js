const calculatePnL = require('../src/utils/calculatePnL');
const formatDate = require('../src/utils/formatDate');

describe('Utility functions', () => {
  describe('calculatePnL', () => {
    it('returns null when exit price is missing', () => {
      expect(
        calculatePnL({ entryPrice: 100, quantity: 1, direction: 'long', exitPrice: null })
      ).toBeNull();
    });

    it('calculates long positions correctly', () => {
      expect(
        calculatePnL({ entryPrice: 100, exitPrice: 110, quantity: 2, direction: 'long' })
      ).toBe(20);
    });

    it('calculates short positions correctly', () => {
      expect(
        calculatePnL({ entryPrice: 100, exitPrice: 90, quantity: 3, direction: 'short' })
      ).toBe(30);
    });
  });

  describe('formatDate', () => {
    it('formats ISO strings to yyyy-mm-dd hh:mm', () => {
      const formatted = formatDate('2023-01-05T10:15:00Z');
      expect(formatted).toMatch(/2023-01-05/);
    });

    it('returns empty string for falsy values', () => {
      expect(formatDate(null)).toBe('');
    });
  });
});
