import mongoose, { Connection } from 'mongoose';

let db: Connection;

type ConnectCallback = (err: Error | null) => void;

export const connectToDb = async (cb: ConnectCallback) => {
  mongoose
    .connect('mongodb://127.0.0.1:27017/movies-lib')
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
