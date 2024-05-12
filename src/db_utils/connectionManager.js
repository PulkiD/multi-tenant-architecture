require('dotenv').config();

const { getNamespace } = require("continuation-local-storage");
const logger = require("../utils/logger");
const { initMasterDbConnection } = require("./masterDb");
const { initTenantDbConnection } = require("./tenantDb");
const { getTenants } = require("../service/base/tenants.service");

const BASE_MONGODB_URI = process.env.BASE_MONGODB_URI;
const BASE_MASTER_DBNAME = process.env.BASE_MASTER_DBNAME;

let connectionMap = {};
let masterDbConnection;

/**
 * Create instance for all the tenants defined in common database and store in a map.
 **/
const connectAllDb = async () => {
    let tenants;
    const MASTER_DB_URI = `${BASE_MONGODB_URI}/${BASE_MASTER_DBNAME}`;
    masterDbConnection = await initMasterDbConnection(MASTER_DB_URI);
    logger.info(`Connected to ${masterDbConnection.name} database!`);
    try {
        tenants = await getTenants(masterDbConnection);
        logger.info(`All tenants: ${JSON.stringify(tenants)}`);
    } catch (err) {
        logger.error("Error while fetching all tenants from app main database", err);
        return;
    }

    for (const tenant of tenants) {
        connectionMap[tenant.tenantID] = await initTenantDbConnection(tenant.dbURI);
    }
};

/**
 * Get the connection information for the given tenant's slug.
 */
const getConnectionByTenant = (tenantID) => {
    logger.info(`Getting connection for ${tenantID}`);
    if (connectionMap) {
        return connectionMap[tenantID];
    }
};

/**
 * Get the master db connection.
 */
const getMasterConnection = () => {
    if (masterDbConnection) {
        logger.info("Getting masterDbConnection!");
        return masterDbConnection;
    }
};

/**
 * Get the connection information (knex instance) for current context. Here we have used a
 * getNamespace from 'continuation-local-storage'. This will let us get / set any
 * information and binds the information to current request context.
 */
const getConnection = () => {
    const nameSpace = getNamespace("unique context");
    const conn = nameSpace.get("connection");

    if (!conn) {
        logger.error("Connection is not set for any tenant database");
        throw new Error("Connection is not set for any tenant database");
    }

    return conn;
};

module.exports = {
    connectAllDb,
    getMasterConnection,
    getConnection,
    getConnectionByTenant
};