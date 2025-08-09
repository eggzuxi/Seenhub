import { connectDB } from "../../../../lib/mongodb";
import { Series } from "../../../../models/Series";
import { NextResponse } from "next/server";
import { searchSeries } from "@/app/api/series/tmdb";

// 추가
export async function POST(req: Request) {
    try {
        const { name, broadcaster, genre, isMasterPiece, comment } = await req.json();
        await connectDB();

        const genreArray = Array.isArray(genre) ? genre : [genre];

        const tmdbSeriesResult = await searchSeries(name);
        if (tmdbSeriesResult && tmdbSeriesResult.length > 0) {
            const tmdbSeries = tmdbSeriesResult[0];
            const newSeries = new Series({
                name: tmdbSeries.name,
                broadcaster,
                genre: genreArray,
                posterPath: tmdbSeries.poster_path,
                isMasterPiece: isMasterPiece,
                comment: comment,
            });
            await newSeries.save();
            return NextResponse.json({ message: "Series added successfully", series: newSeries }, { status: 201 });
        } else {
            return NextResponse.json({ error: "Could not find the series on TMDB" }, { status: 404 });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to add data." }, { status: 500 });
    }
}

// 조회
export async function GET() {
    try {
        await connectDB();

        const series = await Series.find({ delflag: false }).sort({ createdAt: -1 });
        return NextResponse.json(series);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to look up data." }, { status: 500 });
    }
}

// 삭제
export async function PUT(req: Request) {
    try {
        await connectDB();

        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: "ID not provided." }, { status: 400 });
        }

        const updatedSeries = await Series.findByIdAndUpdate(
            id,
            { delflag: true },
            { new: true }
        );

        if (!updatedSeries) {
            return NextResponse.json({ error: "Series not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Series has been deleted.", series: updatedSeries });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to delete series." }, { status: 500 });
    }
}