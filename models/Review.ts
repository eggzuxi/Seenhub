import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    comment: { type: String, required: true }
});

export const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
