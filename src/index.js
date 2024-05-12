require('dotenv').config();

const express = require('express');

const app = express();
const port = process.env.PORT || 3001;

app.use('/', (req, res) => {
    return res.send('Welcome to the Multi-tenant architecture example!');
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});