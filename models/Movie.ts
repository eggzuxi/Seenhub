import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    genre: { type: [String], required: true,
        enum: ["Romance", "Anime", "Action", "SF", "Drama", "Adventure", "Horror", "Fantasy", "Comedy", "Thriller", "Mystery"]
    },
    createdAt: { type: Date, default: Date.now },
    delflag: { type: Boolean, default: false },
});

export const Movie = mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
