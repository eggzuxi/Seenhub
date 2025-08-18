import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 추가
export async function POST(req: Request) {
    try {

        const body = await req.json();

        const res = await fetch(`${BASE_URL}/api/series/add`, {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify(body)
        })

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.message }, { status: res.status });
        }

        return NextResponse.json({ message: "Series created successfully" });

    } catch (error: unknown) {

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to add data." }, { status: 500 });
    }
}

// 조회
export async function GET(req: Request) {
    try {

        const url = new URL(req.url);
        const page = url.searchParams.get("page");
        const size = url.searchParams.get("size");

        const res = await fetch(`${BASE_URL}/api/series/all?page=${page}&size=${size}`);

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
        return NextResponse.json({ error: "Failed to look up data." }, { status: 500 });
    }
}

// 삭제
export async function DELETE(req: Request, { params } : { params: { id: string } }) {
    try {

        const { id } = params;

        const res = await fetch(`${BASE_URL}/api/series/delete/${id}`, {
            method: "DELETE"
        })

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.message }, { status: res.status });
        }

        return NextResponse.json({ message: "Series has been deleted."});

    } catch (error: unknown) {

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to delete series." }, { status: 500 });
    }
}