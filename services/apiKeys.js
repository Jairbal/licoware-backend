//const {MongoLib} = require('../lib/mongo');
const apiKeySchema = require("../utils/schemas/api-keys");

class ApiKeysService {
    constructor() {
        this.collection = 'api-keys';
       // this.mongoDB = new MongoLib();
    }

    async getApiKey({ token }) {
        const [apiKey] = await apiKeySchema.find({ token });
        //const [ apiKey] = await this.mongoDB.getAll(this.collection, { token });
        return apiKey;
    }
}

module.exports = ApiKeysService;