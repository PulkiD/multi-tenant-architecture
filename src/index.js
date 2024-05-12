require('dotenv').config();

const express = require('express');
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

const { connectAllDb } = require('./db_utils/connectionManager');
const tenantRouter = require('./routes/tenant.route');

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

app.use('/api/tenants', tenantRouter);

app.use((req, res, next) => {
    if (!req.route) {
        const error = new Error("No route matched");
        error.status = 404;
        return next(error);
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});