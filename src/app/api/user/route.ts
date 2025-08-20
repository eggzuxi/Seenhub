import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 계정 생성
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const res = await fetch(`${BASE_URL}/api/user/add`, {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.message }, { status: res.status });
        }

        return NextResponse.json({ message: "User created successfully"});

    } catch (error: unknown) {

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}

// 계정 조회
export async function GET() {

    try {

        const res = await fetch(`${BASE_URL}/api/user/all`);

        if (!res.ok) {

            const errorData = await res.json();
            return NextResponse.json({ error: errorData.message }, { status: res.status });

        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error: unknown) {

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });

    }

}

// 계정 수정
export async function PATCH(req: NextRequest, context: any) {
    try {
        const { id } = context.params;
        const body = await req.json();

        const res = await fetch(`${BASE_URL}/api/user/edit/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.message }, { status: res.status });
        }

        return NextResponse.json({ message: "User updated successfully" });

    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "User update failed" }, { status: 500 });
    }
}

// 계정 삭제
export async function DELETE(req: NextRequest, context: any) {
    try {

        const { id } = context.params;

        const res = await fetch(`${BASE_URL}/api/user/delete/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.message }, { status: res.status });
        }

        return NextResponse.json({ message: "User has been deleted"});

    } catch (error: unknown) {

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "User delete failed" }, { status: 500 });

    }
}