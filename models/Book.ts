import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    delflag: { type: Boolean, default: false },
});

export const Book = mongoose.models.Book || mongoose.model("Book", BookSchema);
