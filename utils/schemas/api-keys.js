const { Schema, model } = require('mongoose');

const apiKeySchema = Schema({
    token: {
        type: String,
        required: true,
    },
    scopes: [String],
});

module.exports = model("api-key", apiKeySchema);