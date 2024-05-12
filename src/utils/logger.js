'use strict';

const winston = require('winston');

// Validate and load environment variables
require('dotenv').config();

// Default to 'info' if LOG_LEVEL is not specified
const logLevel = process.env.LOG_LEVEL || 'info';

// Create a Winston logger that streams to console
const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }), // To log stack traces
        winston.format.splat(), // To support printf-style string interpolation
        winston.format.json() // Log in JSON format
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ all: true }), // Colorize log levels
                winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
            )
        })
    ]
});

module.exports = logger;
