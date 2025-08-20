import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 조회
// export async function GET() {
//     try {
//
//         const series = await Series.find({ delflag: false }).sort({ createdAt: -1 });
        // return NextResponse.json(series);
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             return NextResponse.json({ error: error.message }, { status: 500 });
//         }
//         return NextResponse.json({ error: "Failed to look up data." }, { status: 500 });
//     }
// }

// 수정
export async function PATCH(req: Request, context: { params: { id: string } }) {

    try {

        const { id } = context.params;
        const body = await req.json();

        const res = await fetch(`${BASE_URL}/api/series/edit/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.message }, { status: res.status });
        }

        return NextResponse.json({ message: "Series updated successfully."});

    } catch (error: unknown) {

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to update series." }, { status: 500 });
    }
}