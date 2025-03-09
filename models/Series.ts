import mongoose from "mongoose";

const SeriesSchema = new mongoose.Schema({
    title: { type: String, required: true },
    broadcaster: { type: String, required: true },
    genre: {
        type: [String],
        required: true,
        enum: ["Drama", "Animation", "Comedy", "Action", "Thriller", "SF", "Fantasy", "Romance", "Documentary", "Disaster", "Horror"],
    },
    createdAt: { type: Date, default: Date.now },
    delflag: { type: Boolean, default: false },
});

export const Series = mongoose.models.Series || mongoose.model("Series", SeriesSchema);