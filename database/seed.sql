INSERT INTO users (email, password, name, role)
VALUES
  ('trader@example.com', '$2a$10$7eqJtq98hPqEX7fNZaFWoOhi5mBC0b.poKT1eZq9VHt3eRGUp7a8e', 'Ava Trader', 'trader')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO strategies (user_id, name, description, timeframe)
VALUES
  (1, 'Breakout Momentum', 'Enter on breakouts with confirmation volume.', '1H'),
  (1, 'Reversion Edge', 'Fade extended moves back to the mean.', '4H')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO trades (user_id, asset, direction, quantity, entry_price, exit_price, strategy_id, opened_at, closed_at, notes)
VALUES
  (1, 'EUR/USD', 'long', 10000, 1.0725, 1.0798, 1, '2024-01-05 09:00:00', '2024-01-05 15:00:00', 'Clean breakout above resistance'),
  (1, 'AAPL', 'short', 50, 192.40, 187.30, 2, '2024-01-10 14:30:00', '2024-01-12 20:00:00', 'Reversion to 20 EMA')
ON DUPLICATE KEY UPDATE notes = VALUES(notes);

INSERT INTO notes (user_id, trade_id, title, content)
VALUES
  (1, 1, 'Mindset', 'Felt confident after pre-market prep. Managed risk well.'),
  (1, 2, 'Improvement', 'Consider partial profit near VWAP on faster moves.')
ON DUPLICATE KEY UPDATE content = VALUES(content);
