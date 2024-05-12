const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        productID: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    },
    {
        collection: 'product',
        timestamps: true
    }
);

module.exports = productSchema;