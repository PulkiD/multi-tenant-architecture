const { createNamespace } = require("continuation-local-storage");

const {
    getConnectionByTenant,
    getMasterConnection
} = require("../db_utils/connectionManager");
const logger = require("../utils/logger");

// Create a namespace for the application.
let nameSpace = createNamespace("unique context");

/**
 * Get the connection instance for the given tenant's ID and set it to the current context.
 */
const resolveTenant = (req, res, next) => {
    const tenantID = req.body.tenantID;

    if (!tenantID) {
        return res.status(500).json(
            { error: `Please provide tenant's ID to connect` }
        );
    }

    // Run the application in the defined namespace. It will contextualize every underlying function calls.
    nameSpace.run(() => {
        const tenantDbConnection = getConnectionByTenant(tenantID);
        logger.info(`Tenant connection resolved for ${tenantDbConnection.name} tenant database.`);
        nameSpace.set("connection", tenantDbConnection);
        next();
    });
};

/**
 * Get the Master db connection instance and set it to the current context.
 */
const setMasterDb = (req, res, next) => {
    // Run the application in the defined namespace. It will contextualize every underlying function calls.
    nameSpace.run(() => {
        const masterDbConnection = getMasterConnection();
        logger.info(`Master connection resolved for ${masterDbConnection.name}.`);
        nameSpace.set("connection", masterDbConnection);
        next();
    });
};

module.exports = { resolveTenant, setMasterDb };