const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    return res.send('Get request for all tenants');
});

module.exports = router;