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

const initTenantDbConnection = async (DB_URL) => {
    try {

        const db = mongoose.createConnection(DB_URL, {
            ...clientOption
        });

        // Connection Events for this tenant connection
        db.on('connected', () => {
            logger.info(`Connected to ${db.name} tenant database!`);
        });

        db.on('error', (err) => {
            logger.error(`Mongoose connection error for ${db.name} tenant databse: ${err}`);
        });

        db.on('disconnected', () => {
            logger.warn(`Mongoose disconnected from ${db.name} tenant database`);
        });

        // Require all schemas
        db.model("productModel", require("../models/product.model"));
        return db;
    } catch (error) {
        logger.error("Error while trying to connect to tenantDBs: ", error);
        throw error; // Re-throw error to propagate it to the calling code
    }
};

module.exports = {
    initTenantDbConnection
};