const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;

let database

const initDb = (callback) => {
    if(database) {
        console.log('Dd is already initialized');
        return callback(null, database);
    }
    MongoClient.connect(process.env.MONGODB_URL)
    .then((client) => {
        console.log('Connected to MongoDB');
        database = client;
        callback(null, database);
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err); 
        callback(err);
    })
};

const getDatabase = () => {
    if(!database) {
         throw Error('Database is not initialized')
    }
    return database;
};


module.exports = {
    initDb,
    getDatabase
};