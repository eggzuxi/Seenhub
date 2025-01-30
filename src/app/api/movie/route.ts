import {connectDB} from "../../../../lib/mongodb";
import {Movie} from "../../../../models/Movie";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try {
        const { title, director, genre, reviewId } = await req.json();
        await connectDB();

        const newMovie = new Movie({ title, director, genre, review: reviewId });
        await newMovie.save();

        return NextResponse.json(newMovie);
    } catch (error) {
        return NextResponse.json({ error: "데이터 추가 실패" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();

        const movies = await Movie.find(); // 모든 영화 조회
        return NextResponse.json(movies);
    } catch (error) {
        return NextResponse.json({ error: "데이터 조회 실패" }, { status: 500 });
    }
}