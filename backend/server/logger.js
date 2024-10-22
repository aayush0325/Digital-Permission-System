const { createLogger, format, transports } = require('winston');
const dotenv = require("dotenv");
dotenv.config();

// Determine if the environment is production
const isProduction = process.env.NODE_ENV === 'production';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    // Conditional console transport
    ...(isProduction ? [] : [new transports.Console()]), // Only log to console in non-production environments

    new transports.File({ filename: './logs/app.log' }),

    new transports.File({
      filename: './logs/error.log',
      level: 'error',
    }),
  ],
});

module.exports = logger;
