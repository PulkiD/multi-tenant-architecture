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
        dbURL: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

const Tenant = mongoose.model('tenant', tenantSchema);

module.exports = Tenant;