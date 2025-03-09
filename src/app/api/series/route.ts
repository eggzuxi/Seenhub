import { connectDB } from "../../../../lib/mongodb";
import { Series } from "../../../../models/Series";
import { NextResponse } from "next/server";

// 추가
export async function POST(req: Request) {
    try {
        const { title, broadcaster, genre } = await req.json();
        await connectDB();

        const genreArray = Array.isArray(genre) ? genre : [genre];

        const newSeries = new Series({ title, broadcaster, genre: genreArray });
        await newSeries.save();

        return NextResponse.json(newSeries);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "시리즈 추가 실패" }, { status: 500 });
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
        return NextResponse.json({ error: "시리즈 조회 실패" }, { status: 500 });
    }
}

// 삭제
export async function PUT(req: Request) {
    try {
        await connectDB();

        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: "ID를 제공해주세요" }, { status: 400 });
        }

        const updatedSeries = await Series.findByIdAndUpdate(
            id,
            { delflag: true },
            { new: true }
        );

        if (!updatedSeries) {
            return NextResponse.json({ error: "시리즈를 찾을 수 없습니다" }, { status: 404 });
        }

        return NextResponse.json({ message: "시리즈가 삭제되었습니다", series: updatedSeries });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "시리즈 삭제 실패" }, { status: 500 });
    }
}