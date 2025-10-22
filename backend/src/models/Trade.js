const { getPool } = require('../config/db');

const mapTrade = (row) => ({
  id: row.id,
  userId: row.user_id,
  asset: row.asset,
  direction: row.direction,
  quantity: row.quantity,
  entryPrice: row.entry_price,
  exitPrice: row.exit_price,
  strategyId: row.strategy_id,
  openedAt: row.opened_at,
  closedAt: row.closed_at,
  notes: row.notes
});

const Trade = {
  async findAllByUser(userId) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM trades WHERE user_id = ? ORDER BY opened_at DESC', [userId]);
    return rows.map(mapTrade);
  },

  async findById(id, userId) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM trades WHERE id = ? AND user_id = ?', [id, userId]);
    return rows.length ? mapTrade(rows[0]) : null;
  },

  async create(userId, trade) {
    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO trades (user_id, asset, direction, quantity, entry_price, exit_price, strategy_id, opened_at, closed_at, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        trade.asset,
        trade.direction,
        trade.quantity,
        trade.entryPrice,
        trade.exitPrice,
        trade.strategyId || null,
        trade.openedAt,
        trade.closedAt,
        trade.notes || null
      ]
    );
    return this.findById(result.insertId, userId);
  },

  async update(id, userId, trade) {
    const pool = getPool();
    const fields = [];
    const values = [];

    Object.entries(trade).forEach(([key, value]) => {
      const column = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      fields.push(`${column} = ?`);
      values.push(value);
    });

    if (!fields.length) {
      return this.findById(id, userId);
    }

    values.push(id, userId);

    await pool.query(`UPDATE trades SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`, values);
    return this.findById(id, userId);
  },

  async remove(id, userId) {
    const pool = getPool();
    await pool.query('DELETE FROM trades WHERE id = ? AND user_id = ?', [id, userId]);
  }
};

module.exports = Trade;
