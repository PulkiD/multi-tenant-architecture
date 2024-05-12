const { getConnection } = require("../db_utils/connectionManager");
const productService = require("../service/tenant/product.service");
const logger = require("../utils/logger");

const getProducts = async (req, res) => {
    try {
        const dbConnection = getConnection();
        logger.info(`Using ${dbConnection.name} tenant database to fetch all products.`);
        const products = await productService.getAllProducts(dbConnection);
        res.status(200).json({ success: true, products });
    } catch (err) {
        logger.error("Error while fetching all products", err);
        res.status(err.statusCode || 500).json({ error: err.message });
    }
};

module.exports = { getProducts };