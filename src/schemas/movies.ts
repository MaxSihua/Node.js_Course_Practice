import mongoose, { Schema } from "mongoose";

const movieSchema = new Schema({
    title: { type: String, required: true },
    genre: { type: Array<string>, required: true },
    releaseDate: { type: Date, required: true },
    description: { type: String, required: true }
},
{
    toJSON: { virtuals: true }
});

const Movie = mongoose.model('movies', movieSchema);

export { Movie };
