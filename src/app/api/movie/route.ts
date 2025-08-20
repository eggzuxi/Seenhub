import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 추가
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const res = await fetch(`${BASE_URL}/api/movie/add`, {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify(body)
        })

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.message }, { status: res.status });
        }

        return NextResponse.json({ message: "Movie created successfully" });

    } catch (error: unknown) {

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ error: "Failed to add data." }, { status: 500 });
    }
}

// 조회 및 검색
export async function GET(req: NextRequest) {
    try {

        const url = new URL(req.url);
        const page = url.searchParams.get("page");
        const size = url.searchParams.get("size");
        const query = url.searchParams.get("query");

        let apiUrl = '';

        if (query) {
            apiUrl = `${BASE_URL}/api/movie/search?query=${query}`;
        } else {
            apiUrl = `${BASE_URL}/api/movie/all?page=${page}&size=${size}`;
        }

        const res = await fetch(apiUrl);

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
export async function DELETE(req: NextRequest, context: any ) {

    try {

        const { id } = context.params;

        const res = await fetch(`${BASE_URL}/api/movie/delete/${id}`, {
            method: "DELETE"
        })

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.message }, { status: res.status });
        }

        return NextResponse.json({ message: "Movie has been deleted."});

    } catch (error: unknown) {

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to delete movie." }, { status: 500 });
    }

}