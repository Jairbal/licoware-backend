const mongoose = require('mongoose');
const { config } = require("../config");

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;
const DB_HOST = config.dbHost;
const PORT = config.dbPort;
const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${DB_HOST}:${PORT}/${DB_NAME}?retryWrites=true&w=majority`;

const dbConnection = async () => {
    try{

        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });

        console.log('Connected successfully to Mongo')

    } catch (e) {
        console.log(e);
        throw new Error('Error to initalize database', e);
    }
}

module.exports = {
    dbConnection
}