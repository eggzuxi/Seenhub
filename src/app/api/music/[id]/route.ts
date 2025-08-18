import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 조회
// export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
//     const { id } = await params;
//
//     try {
//
//         if (!isValidObjectId(id)) {
//             return NextResponse.json({ error: "Invalid ID format." }, { status: 400 });
//         }
//
//         const music = await Music.findById(id);
//
//         if (!music || music.delflag) {
//             return NextResponse.json({ error: "Music not found." }, { status: 404 });
//         }
//
//         return NextResponse.json(music);
//     } catch (error: unknown) {
//         console.error("Error fetching music by ID:", error);
//         if (error instanceof Error) {
//             return NextResponse.json({ error: error.message }, { status: 500 });
//         }
//         return NextResponse.json({ error: "Failed to fetch music." }, { status: 500 });
//     }
// }

// 수정
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await req.json();

        const res = await fetch(`${BASE_URL}/api/book/edit/${id}`, {
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
        return NextResponse.json({ error: "Music update failed" }, { status: 500 });
    }
}