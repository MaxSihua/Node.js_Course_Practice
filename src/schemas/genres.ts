import mongoose, { Schema } from "mongoose";

const genreSchema = new Schema({
    name: { type: String, required: true }
},
{
    toJSON: { virtuals: true }
});

const Genres = mongoose.model('genres', genreSchema);

export { Genres };
