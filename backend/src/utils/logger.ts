import winston from 'winston';
// Use require for winston to avoid TypeScript issues
const { createLogger, format, transports, addColors } = require('winston');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
addColors(colors);

// Define the format for logs
const customFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  format.colorize({ all: true }),
  format.printf(
    (info: any) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define which transports to use
const customTransports = [
  // Console transport for all logs
  new transports.Console(),
  // File transport for errors
  new transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  // File transport for all logs
  new transports.File({ filename: 'logs/all.log' }),
];

// Create the logger
export const logger = createLogger({
  level: process.env.LOG_LEVEL || level(),
  levels,
  format: customFormat,
  transports: customTransports,
});

// Export a stream object for Morgan
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
}; 