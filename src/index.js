require('dotenv').config();

const express = require('express');
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

const { connectAllDb } = require('./db_utils/connectionManager');
const tenantRouter = require('./routes/tenant.route');
const productRouter = require('./routes/product.route');

const app = express();
const port = process.env.PORT || 3001;
// helmet for security purpose
app.use(helmet());
// CORS to hanlde cross origin requests
app.use(cors());
// Parsing the body of the http
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connectAllDb();

const connectionResolver = require('./middlewares/connectionResolver');
app.use('/api/tenants', tenantRouter);
app.use('/api/products', connectionResolver.resolveTenant, productRouter);

app.use((req, res, next) => {
    return res.status(404).send("Sorry, can't find that!");
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});