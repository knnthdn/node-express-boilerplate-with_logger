/**
 * node_modules
 */

import winston from 'winston';

/**
 * custom modules
 */

import config from '../config/index';

// Definethe transport array to hold different logging transport
const { combine, timestamp, json, prettyPrint, errors } = winston.format;

//custom output
const customOutput = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY:MM:DD hh:mm:ss' }),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      return `${timestamp} [${level}]: ${message}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

const jsonType = winston.createLogger({
  format: combine(
    json(),
    timestamp({ format: 'YYYY:MM:DD HH:MM:SS' }),
    prettyPrint(),
    errors({ stack: true }),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

const logger = config.LOG_TYPE === 'custom' ? customOutput : jsonType;

export { logger };
