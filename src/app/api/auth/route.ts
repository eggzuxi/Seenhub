import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 로그인
export async function POST(req: Request) {

    try {

        const body = await req.json();

        const res = await fetch(`${BASE_URL}/api/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if(!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.message }, { status: res.status })
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error: unknown) {

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ error: "Login failed" }, { status: 500 });

    }

}

// 로그아웃
export async function DELETE() {
    (await cookies()).delete("token");
    return NextResponse.json({ message: "Logged out" });
}