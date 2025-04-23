import { Schema, model, Model, Document } from 'mongoose';

interface MovieDocument extends Document {
    title: string;
    director: string;
    genre: string[];
    posterPath: string;
    isMasterPiece: boolean;
    createdAt: Date;
    delflag: boolean;
}

const MovieSchema = new Schema<MovieDocument>({
    title: { type: String, required: true },
    director: { type: String, required: true },
    genre: {
        type: [String],
        required: true,
        enum: ["Romance", "Anime", "Action", "SF", "Drama", "Adventure", "Horror", "Fantasy", "Comedy", "Thriller", "Mystery"],
    },
    posterPath: { type: String, required: true },
    isMasterPiece: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    delflag: { type: Boolean, default: false },
});

const Movie = model<MovieDocument, Model<MovieDocument>>('Movie', MovieSchema);

export { Movie };