import { connectDB } from "../../../../../lib/mongodb";
import { Series } from "../../../../../models/Series";
import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";

// 조회
export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        await connectDB();

        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: "Invalid ID format." }, { status: 400 });
        }

        const series = await Series.findById(id);

        if (!series || series.delflag) {
            return NextResponse.json({ error: "Series not found." }, { status: 404 });
        }

        return NextResponse.json(series);
    } catch (error: unknown) {
        console.error("Error fetching series by ID:", error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to fetch series." }, { status: 500 });
    }
}

// 수정
export async function PATCH(req: Request, { params }: { params: { id: string } }) {

    const { id } = params;
    const { title, broadcaster, genre } = await req.json();

    try {
        await connectDB();

        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: "Invalid ID format." }, { status: 400 });
        }

        const updateData: { title?: string; broadcaster?: string; genre?: string[] } = {};
        if (title !== undefined) {
            updateData.title = title;
        }
        if (broadcaster !== undefined) {
            updateData.broadcaster = broadcaster;
        }
        if (genre !== undefined) {
            const genreArray = Array.isArray(genre) ? genre : [genre];
            updateData.genre = genreArray;
        }

        const updatedSeries = await Series.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedSeries) {
            return NextResponse.json({ error: "Series not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Series updated successfully.", series: updatedSeries });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to update series." }, { status: 500 });
    }
}