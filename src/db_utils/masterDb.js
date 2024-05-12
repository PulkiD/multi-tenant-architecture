const mongoose = require("mongoose");
const logger = require("../utils/logger");

mongoose.Promise = global.Promise;

const clientOption = {
    socketTimeoutMS: 30000,
};

// Connection Events
mongoose.connection.on("connected", () => {
    logger.info("Mongoose default connection open");
});

mongoose.connection.on("error", err => {
    logger.error("Mongoose default connection error: " + err);
});

mongoose.connection.on("disconnected", () => {
    logger.warn("Mongoose default connection disconnected");
});

process.on("SIGINT", () => {
    mongoose.connection.close(() => {
        logger.info("Mongoose default connection disconnected through app termination");
        process.exit(0);
    });
});

const initMasterDbConnection = async (DB_URL) => {
    try {
        await mongoose.connect(DB_URL, {
            ...clientOption
        });

        const db = mongoose.connection;

        // Check connection
        db.once('open', () => {
            logger.info(`Connected to ${db.name} main database!`);
        });

        // Check for MongoDB connection error
        db.on('error', (error) => {
            logger.error(`Mongoose connection error for ${db.name} database: ${error}`);
        });

        db.on('disconnected', () => {
            logger.warn(`Mongoose disconnected from ${db.name}`);
        });

        // Require all schemas
        require("../models/tenant.model");
        return db;
    } catch (error) {
        logger.error("Error while trying to connect to main database of the app: ", error);
        throw error; // Re-throw error to propagate it to the calling code
    }

};

module.exports = {
    initMasterDbConnection
};
