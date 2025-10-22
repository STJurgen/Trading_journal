const { getPool } = require('../config/db');

const mapUser = (row) => ({
  id: row.id,
  email: row.email,
  password: row.password,
  name: row.name,
  role: row.role,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const User = {
  async findByEmail(email) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length ? mapUser(rows[0]) : null;
  },

  async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows.length ? mapUser(rows[0]) : null;
  },

  async create({ email, password, name, role = 'trader' }) {
    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, password, name, role]
    );
    return this.findById(result.insertId);
  },

  async updateProfile(id, data) {
    const pool = getPool();
    const fields = [];
    const values = [];

    Object.entries(data).forEach(([key, value]) => {
      fields.push(`${key} = ?`);
      values.push(value);
    });

    if (!fields.length) {
      return this.findById(id);
    }

    values.push(id);

    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }
};

module.exports = User;
