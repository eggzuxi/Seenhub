import { connectDB } from "../../../../lib/mongodb";
import { User } from "../../../../models/User";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

// 계정 생성
export async function POST(req: Request) {
    try {
        const { id, password, name } = await req.json();
        await connectDB();

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 새 사용자 생성
        const newUser = new User({
            id,
            password: hashedPassword,
            name
        });

        await newUser.save();

        return NextResponse.json({ message: "User created successfully", user: newUser });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "User creation failed" }, { status: 500 });
    }
}

// 계정 조회 (삭제되지 않은 유저 목록)
export async function GET() {
    try {
        await connectDB();

        const users = await User.find({ delFlag: false }).select("-password"); // 비밀번호 제외
        return NextResponse.json(users);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "User retrieval failed" }, { status: 500 });
    }
}

// 계정 삭제 (소프트 삭제 - delFlag 변경)
export async function PUT(req: Request) {
    try {
        await connectDB();
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { delFlag: true },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User has been deleted", user: updatedUser });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "User deletion failed" }, { status: 500 });
    }
}
