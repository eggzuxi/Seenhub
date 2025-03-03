import mongoose from "mongoose";

const MusicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    genre: { type: [String], required: true,
        enum: ["Pop", "Rock", "Metal", "Hiphop", "Jazz", "Indie", "Classic", "Dance", "J-Pop", "R&B", "Soul"]
    },
    createdAt: { type: Date, default: Date.now },
    delflag: { type: Boolean, default: false },
});

export const Music = mongoose.models.Music || mongoose.model("Music", MusicSchema);
