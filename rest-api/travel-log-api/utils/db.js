const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require("dotenv");

dotenv.config();

const connectDb = () => {
    try {
        const mClient = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        mClient.connect().then(() => {
            //
        })
        const db = mClient.db("main");

        return db;
    } catch (err) {
        console.log(err.stack);
    }
};

exports.connectDb = connectDb;