import mongoose, { Connection } from 'mongoose';
import { config } from 'dotenv';

config();

const dbUrl = process.env.DB_URL;

let db: Connection;

type ConnectCallback = (err: Error | null) => void;

export const connectToDb = async (cb: ConnectCallback) => {
  mongoose
    .connect(dbUrl!)
    .then(() => {
      db = mongoose.connection;
      return cb(null);
    })
    .catch((err: Error) => {
      console.error(err.stack);
      return cb(err);
    });
};

export const getDb = (): Connection => {
  return db;
};
