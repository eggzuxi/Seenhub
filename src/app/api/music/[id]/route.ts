import { NextResponse, NextRequest } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 수정
export async function PATCH( req: NextRequest, context: any ) {

    try {

        const { id } = context.params;
        const body = await req.json();

        const res = await fetch(`${BASE_URL}/api/music/edit/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.message }, { status: res.status });
        }

        return NextResponse.json({ message: "Music updated successfully" });

    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to update music." }, { status: 500 });
    }
}