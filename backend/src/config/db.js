const mysql = require('mysql2/promise');
const config = require('./env');

let pool;

const getPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.name,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  return pool;
};

module.exports = {
  getPool
};
