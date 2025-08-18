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
//         const movie = await Movie.findById(id);
//
//         if (!movie || movie.delflag) {
//             return NextResponse.json({ error: "Movie not found." }, { status: 404 });
//         }
//
//         return NextResponse.json(movie);
//     } catch (error: unknown) {
//         console.error("Error fetching movie by ID:", error);
//         if (error instanceof Error) {
//             return NextResponse.json({ error: error.message }, { status: 500 });
//         }
//         return NextResponse.json({ error: "Failed to fetch movie." }, { status: 500 });
//     }
// }

// 수정
export async function PATCH(req: Request, { params }: { params: { id: string } }) {

    try {

        const { id } = params;
        const body = await req.json();

        const res = await fetch(`${BASE_URL}/api/movie/edit/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.message }, { status: res.status });
        }

        return NextResponse.json({ message: "Movie updated successfully."});

    } catch (error: unknown) {

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to update movie." }, { status: 500 });
    }
}