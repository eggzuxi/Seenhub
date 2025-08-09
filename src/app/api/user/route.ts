import { connectDB } from "../../../../lib/mongodb";
import { User } from "../../../../models/User";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET as string;

// 계정 생성
export async function POST(req: Request) {
    try {
        const { id, password, name, login } = await req.json();
        await connectDB();

        if (login) {
            // 로그인 처리
            const user = await User.findOne({ id });

            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
            }

            // JWT 생성
            const token = jwt.sign({ id: user.id, name: user.name }, SECRET_KEY, { expiresIn: "1h" });

            // 쿠키에 JWT 저장
            (await cookies()).set("token", token, { httpOnly: true, secure: true, maxAge: 3600 });

            return NextResponse.json({ message: "Login successful", user: { id: user.id, name: user.name } });
        } else {
            // 회원가입 처리
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                id,
                password: hashedPassword,
                name,
            });

            await newUser.save();
            return NextResponse.json({ message: "User created successfully", user: newUser });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "User processing failed" }, { status: 500 });
    }
}

// 로그인 상태 확인 API
export async function GET() {
    try {
        await connectDB();

        const token = (await cookies()).get("token");
        const isAuthenticated = !!token; // 토큰 존재 여부로 로그인 상태 확인

        const users = await User.find({ delFlag: false }).select("-password");

        if (isAuthenticated) {
            try {
                const decoded = jwt.verify(token.value, SECRET_KEY);
                return NextResponse.json({
                    authenticated: true,
                    user: decoded,
                    users: users // 로그인된 경우 사용자 목록과 함께 decoded 정보 반환
                });
            } catch (error: unknown) {
                if (error instanceof Error) {
                    return NextResponse.json({ error: error.message }, { status: 500 });
                }
                return NextResponse.json({
                    authenticated: false,
                    users: users // 토큰은 유효하지 않지만 사용자 목록은 반환
                });
            }
        } else {
            return NextResponse.json({
                authenticated: false,
                users: users // 로그인되지 않은 경우 사용자 목록만 반환
            });
        }

    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

// 로그아웃 API (쿠키 삭제)
export async function DELETE() {
    (await cookies()).delete("token");
    return NextResponse.json({ message: "Logged out" });
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