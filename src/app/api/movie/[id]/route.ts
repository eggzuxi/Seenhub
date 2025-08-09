import { connectDB } from "../../../../../lib/mongodb";
import { Movie } from "../../../../../models/Movie";
import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";

// 조회
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        await connectDB();

        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: "Invalid ID format." }, { status: 400 });
        }

        const movie = await Movie.findById(id);

        if (!movie || movie.delflag) {
            return NextResponse.json({ error: "Movie not found." }, { status: 404 });
        }

        return NextResponse.json(movie);
    } catch (error: unknown) {
        console.error("Error fetching movie by ID:", error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to fetch movie." }, { status: 500 });
    }
}

// 수정
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    const { title, director, genre, isMasterPiece, comment } = await req.json();

    try {
        await connectDB();

        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: "Invalid ID format." }, { status: 400 });
        }

        const updateData: { title?: string; director?: string; genre?: string[]; isMasterPiece?: boolean; comment?: string; } = {};
        if (title !== undefined) {
            updateData.title = title;
        }
        if (director !== undefined) {
            updateData.director = director;
        }
        if (genre !== undefined) {
            const genreArray = Array.isArray(genre) ? genre : [genre];
            updateData.genre = genreArray;
        }
        if (isMasterPiece !== undefined) {
            updateData.isMasterPiece = isMasterPiece;
        }
        if (comment !== undefined) {
            updateData.comment = comment;
        }

        const updatedMovie = await Movie.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedMovie) {
            return NextResponse.json({ error: "Movie not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Movie updated successfully.", movie: updatedMovie });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to update movie." }, { status: 500 });
    }
}