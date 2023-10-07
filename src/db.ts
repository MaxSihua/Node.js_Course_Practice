import { MongoClient } from 'mongodb';
import { Db } from 'mongodb';

let db: Db;

export const connectToDb = async (cb: Function) => {
    MongoClient.connect('mongodb://127.0.0.1:27017/movies-lib')
    .then((client: MongoClient) => {
        db = client.db();
        return cb();
    })
    .catch((err: Error) => {
        console.error(err.stack);
        return cb(err);
    });
};

export const getDb = (): Db => {
    return db;
};
