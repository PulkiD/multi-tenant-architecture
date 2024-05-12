const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema(
    {
        tenantID: {
            type: String,
            required: true,
            unique: true
        },
        tenantName: {
            type: String,
            required: true,
        },
        currency: {
            type: String,
        },
        dbURI: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        collection: 'tenant',
        timestamps: true
    }
);

module.exports = mongoose.model('tenantModel', tenantSchema);