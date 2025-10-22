const { getPool } = require('../config/db');

const mapNote = (row) => ({
  id: row.id,
  userId: row.user_id,
  tradeId: row.trade_id,
  title: row.title,
  content: row.content,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const Note = {
  async findAllByTrade(tradeId, userId) {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT * FROM notes WHERE trade_id = ? AND user_id = ? ORDER BY created_at DESC',
      [tradeId, userId]
    );
    return rows.map(mapNote);
  },

  async create(userId, tradeId, note) {
    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO notes (user_id, trade_id, title, content) VALUES (?, ?, ?, ?)',
      [userId, tradeId, note.title, note.content]
    );
    return this.findById(result.insertId, userId);
  },

  async findById(id, userId) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM notes WHERE id = ? AND user_id = ?', [id, userId]);
    return rows.length ? mapNote(rows[0]) : null;
  },

  async update(id, userId, note) {
    const pool = getPool();
    const fields = [];
    const values = [];

    Object.entries(note).forEach(([key, value]) => {
      const column = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      fields.push(`${column} = ?`);
      values.push(value);
    });

    if (!fields.length) {
      return this.findById(id, userId);
    }

    values.push(id, userId);
    await pool.query(`UPDATE notes SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`, values);
    return this.findById(id, userId);
  },

  async remove(id, userId) {
    const pool = getPool();
    await pool.query('DELETE FROM notes WHERE id = ? AND user_id = ?', [id, userId]);
  }
};

module.exports = Note;
