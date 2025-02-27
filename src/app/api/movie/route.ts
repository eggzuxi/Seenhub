import {connectDB} from "../../../../lib/mongodb";
import {Movie} from "../../../../models/Movie";
import {NextResponse} from "next/server";

// 추가
export async function POST(req: Request) {
    try {
        const { title, director, genre } = await req.json();
        await connectDB();

        const newMovie = new Movie({ title, director, genre });
        await newMovie.save();

        return NextResponse.json(newMovie);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "데이터 추가 실패" }, { status: 500 });
    }
}

// 조회
export async function GET() {
    try {
        await connectDB();

        const movies = await Movie.find({ delflag: false }).sort({ createdAt: -1 });
        return NextResponse.json(movies);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "데이터 조회 실패" }, { status: 500 });
    }
}

// 삭제
export async function PUT(req: Request) {

    try {
        await connectDB();

        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: "ID not provided" }, { status: 400 });
        }

        const updatedMovie = await Movie.findByIdAndUpdate(
            id,
            { delflag: true },
            { new: true }
        );

        if (!updatedMovie) {
            return NextResponse.json({ error: "Movie not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Movie has been deleted", movie: updatedMovie });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 });
    }

}