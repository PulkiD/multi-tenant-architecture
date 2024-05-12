const getAllProducts = async (tenantDbConnection) => {
    try {
        const productModel = await tenantDbConnection.model("productModel");
        const products = await productModel.find({});
        console.log("getAllProducts: ", products);
        return products;
    } catch (error) {
        console.log("getAllProducts error: ", error);
        throw error;
    }
};

module.exports = { getAllProducts };