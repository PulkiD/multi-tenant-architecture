require('dotenv').config();

const logger = require("../../utils/logger");

const getTenants = async (masterDbConnection) => {
    let tenants;
    try {
        const tenantModel = await masterDbConnection.model('tenantModel');
        tenants = await tenantModel.find({});
    } catch (err) {
        logger.error("While trying to fetch all tenants from master db", err);
        return [];
    }
    return tenants;
};
module.exports = { getTenants };