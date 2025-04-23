import { Schema, model, Model, Document } from 'mongoose';

interface BookDocument extends Document {
    title: string;
    author: string;
    genre: string[];
    thumbnail: string;
    isMasterPiece: boolean;
    createdAt: Date;
    delflag: boolean;
}

const BookSchema = new Schema<BookDocument>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: [String], required: true,
        enum: ["Fiction", "Non-Fiction", "Mystery", "Thriller", "Romance", "Fantasy", "SF", "Horror", "Adventure", "Historical Fiction", "Biography", "Autobiography", "Self-Help", "Health & Wellness", "Psychology", "Philosophy", "Science", "Business", "Politics", "Religion & Spirituality", "Cookbook", "Educational"]
    },
    thumbnail: { type: String, required: false },
    isMasterPiece: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    delflag: { type: Boolean, default: false },
});

const Book = model<BookDocument, Model<BookDocument>>('Book', BookSchema);

export { Book };