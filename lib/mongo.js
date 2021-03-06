const { MongoClient, ObjectId } = require("mongodb");
const { config } = require("../config");

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;
const DB_HOST = config.dbHost;
const PORT = config.dbPort;

//online
//const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${DB_HOST}:${PORT}/${DB_NAME}?retryWrites=true&w=majority`;
//localhost
const MONGO_URI = `mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`;

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.dbName = DB_NAME;
  }

  connect() {
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect((err) => {
          if (err) {
            reject(err);
          }

          console.log("Connected successfully to Mongo");
          resolve(this.client.db(this.dbName));
        });
      });
    }
    return MongoLib.connection;
  }

  getAll(collection, query, sort = {}) {
    return this.connect().then((db) => {
      return db.collection(collection).find(query).sort(sort).toArray();
    });
  }

  get(collection, id) {
    return this.connect().then((db) => {
      return db.collection(collection).findOne({ _id: ObjectId(id) });
    });
  }

  create(collection, data) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).insertOne(data);
      })
      .then((result) => result.insertedId);
  }

  update(collection, id, data) {
    return this.connect()
      .then((db) => {
        return db
          .collection(collection)
          .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
      })
      .then((result) => {
        result.upsertedId || id;
      });
  }

  delete(collection, id) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).deleteOne({ _id: ObjectId(id) });
      })
      .then(() => id);
  }

  deleteMany(collection, query) {
    return this.connect().then((db) => {
      return db.collection(collection).deleteMany(query);
    });
  }
}

module.exports = { MongoLib };
