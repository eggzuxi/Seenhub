import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: [String], required: true,
        enum: ["Fiction", "Non-Fiction", "Mystery", "Thriller", "Romance", "Fantasy", "SF", "Horror", "Adventure", "Historical Fiction", "Biography", "Autobiography", "Self-Help", "Health & Wellness", "Psychology", "Philosophy", "Science", "Business", "Politics", "Religion & Spirituality", "Cookbook", "Educational"]
    },
    createdAt: { type: Date, default: Date.now },
    delflag: { type: Boolean, default: false },
});

export const Book = mongoose.models.Book || mongoose.model("Book", BookSchema);
