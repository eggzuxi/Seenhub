import { Schema, model, Model, Document } from 'mongoose';

interface SeriesDocument extends Document {
    title: string;
    broadcaster: string;
    genre: string[];
    createdAt: Date;
    delflag: boolean;
}

const SeriesSchema = new Schema<SeriesDocument>({
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

const Series = model<SeriesDocument, Model<SeriesDocument>>('Series', SeriesSchema);

export { Series };