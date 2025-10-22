const dotenv = require('dotenv');

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'trading_journal'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecretkey',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refreshsecretkey',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  }
};

module.exports = config;
