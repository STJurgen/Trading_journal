const { getPool } = require('../config/db');

const mapStrategy = (row) => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  description: row.description,
  timeframe: row.timeframe,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const Strategy = {
  async findAllByUser(userId) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM strategies WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows.map(mapStrategy);
  },

  async findById(id, userId) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM strategies WHERE id = ? AND user_id = ?', [id, userId]);
    return rows.length ? mapStrategy(rows[0]) : null;
  },

  async create(userId, strategy) {
    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO strategies (user_id, name, description, timeframe) VALUES (?, ?, ?, ?)',
      [userId, strategy.name, strategy.description || null, strategy.timeframe || null]
    );
    return this.findById(result.insertId, userId);
  },

  async update(id, userId, strategy) {
    const pool = getPool();
    const fields = [];
    const values = [];

    Object.entries(strategy).forEach(([key, value]) => {
      const column = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      fields.push(`${column} = ?`);
      values.push(value);
    });

    if (!fields.length) {
      return this.findById(id, userId);
    }

    values.push(id, userId);

    await pool.query(`UPDATE strategies SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`, values);
    return this.findById(id, userId);
  },

  async remove(id, userId) {
    const pool = getPool();
    await pool.query('DELETE FROM strategies WHERE id = ? AND user_id = ?', [id, userId]);
  }
};

module.exports = Strategy;
