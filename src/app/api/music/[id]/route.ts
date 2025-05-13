import { connectDB } from "../../../../../lib/mongodb";
import { Music } from "../../../../../models/Music";
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

        const music = await Music.findById(id);

        if (!music || music.delflag) {
            return NextResponse.json({ error: "Music not found." }, { status: 404 });
        }

        return NextResponse.json(music);
    } catch (error: unknown) {
        console.error("Error fetching music by ID:", error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to fetch music." }, { status: 500 });
    }
}

// 수정
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    const { title, artist, genre, isMasterPiece, comment } = await req.json();

    try {
        await connectDB();

        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: "Invalid ID format." }, { status: 400 });
        }

        const genreArray = Array.isArray(genre) ? genre : [genre];

        const updatedMusic = await Music.findByIdAndUpdate(
            id,
            {
                ...(title && { title }),
                ...(artist && { artist }),
                ...(genre && { genre: genreArray }),
                ...(typeof isMasterPiece === "boolean" && { isMasterPiece }),
                ...(comment && { comment }),
            },
            { new: true }
        );

        if (!updatedMusic) {
            return NextResponse.json({ error: "Music not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Music updated successfully.", music: updatedMusic });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to update music." }, { status: 500 });
    }
}