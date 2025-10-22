const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ level, message, timestamp }) => `${timestamp} [${level}] ${message}`)
  ),
  transports: [new transports.Console()]
});

const stream = {
  write: (message) => logger.info(message.trim())
};

module.exports = {
  logger,
  stream,
  error: (...args) => logger.error(...args),
  info: (...args) => logger.info(...args)
};
