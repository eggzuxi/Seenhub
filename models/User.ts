import { Schema, model, Model, Document } from 'mongoose';

interface UserDocument extends Document {
    id: string;
    password: string;
    name: string;
    createdAt: Date;
    delFlag: boolean;
}

const UserSchema = new Schema<UserDocument>({
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    delFlag: { type: Boolean, default: false }, // 삭제 여부 플래그
});

const User = model<UserDocument, Model<UserDocument>>('User', UserSchema);

export { User };