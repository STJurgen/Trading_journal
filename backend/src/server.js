const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/env');
const { getPool } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const strategyRoutes = require('./routes/strategyRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const { logger, stream } = require('./utils/logger');

const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
app.use(morgan('dev', { stream }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/auth', authRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/strategies', strategyRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(errorHandler);

const start = async () => {
  try {
    const connection = await getPool().getConnection();
    connection.release();
    logger.info('Database connection pool initialized');
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }

  app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  });
};

if (require.main === module) {
  start();
}

module.exports = { app, start };
