import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    delFlag: { type: Boolean, default: false }, // 삭제 여부 플래그
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
