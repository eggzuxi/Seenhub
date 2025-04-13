import { connectDB } from "../../../../lib/mongodb";
import { Movie } from "../../../../models/Movie";
import { NextResponse } from "next/server";
import { searchMovie } from "@/app/api/movie/tmdb";

// 추가
export async function POST(req: Request) {
    try {
        const { title, director, genre } = await req.json();
        await connectDB();

        const genreArray = Array.isArray(genre) ? genre : [genre];

        // TMDB에서 영화 검색 후 Movie 모델에 저장
        const tmdbMovies = await searchMovie(title);
        if (tmdbMovies && tmdbMovies.length > 0) {
            const tmdbMovie = tmdbMovies[0]; // 첫 번째 결과 사용 (필요에 따라 수정)
            const newMovie = new Movie({
                title: tmdbMovie.title,
                director,
                genre: genreArray,
                posterPath: tmdbMovie.poster_path, // posterPath 추가
            });
            await newMovie.save();
            return NextResponse.json(newMovie);
        } else {
            return NextResponse.json({ error: "Could not find the movie on TMDB." }, { status: 404 });
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

        const movies = await Movie.find({ delflag: false }).sort({ createdAt: -1 });
        return NextResponse.json(movies);
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

        const updatedMovie = await Movie.findByIdAndUpdate(
            id,
            { delflag: true },
            { new: true }
        );

        if (!updatedMovie) {
            return NextResponse.json({ error: "Movie not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Movie has been deleted.", movie: updatedMovie });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to delete movie." }, { status: 500 });
    }

}