import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    genre: { type: String, required: true },
    review: { type: mongoose.Schema.Types.ObjectId, ref: "Review" }
});

export const Movie = mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
