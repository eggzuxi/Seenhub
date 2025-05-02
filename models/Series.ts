import { Schema, model, Model, Document } from 'mongoose';

interface SeriesDocument extends Document {
    name: string;
    broadcaster: string;
    genre: string[];
    posterPath: string;
    isMasterPiece: boolean;
    createdAt: Date;
    delflag: boolean;
}

const SeriesSchema = new Schema<SeriesDocument>({
    name: { type: String, required: true },
    broadcaster: { type: String, required: true },
    genre: {
        type: [String],
        required: true,
        enum: ["Drama", "Animation", "Comedy", "Action", "Thriller", "SF", "Fantasy", "Romance", "Documentary", "Disaster", "Horror"],
    },
    posterPath: { type: String, required: true },
    isMasterPiece: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    delflag: { type: Boolean, default: false },
});

const Series = model<SeriesDocument, Model<SeriesDocument>>('Series', SeriesSchema);

export { Series };