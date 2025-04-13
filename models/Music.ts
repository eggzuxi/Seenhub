import { Schema, model, Model, Document } from 'mongoose';

interface MusicDocument extends Document {
    mbid: string;
    title: string;
    artist: string;
    genre: string[];
    createdAt: Date;
    delflag: boolean;
}

const MusicSchema = new Schema<MusicDocument>({
    mbid: { type: String, required: true },
    title: { type: String, required: true },
    artist: { type: String, required: true },
    genre: {
        type: [String],
        required: true,
        enum: ["Pop", "Rock", "Metal", "Hiphop", "Jazz", "Indie", "Classic", "Dance", "J-Pop", "R&B", "Soul", "Ballad"],
    },
    createdAt: { type: Date, default: Date.now },
    delflag: { type: Boolean, default: false },
});

const Music = model<MusicDocument, Model<MusicDocument>>('Music', MusicSchema);

export { Music };