import {connectDB} from "../../../../lib/mongodb";
import {Music} from "../../../../models/Music";
import {NextResponse} from "next/server";

// 추가
export async function POST(req: Request) {
    try {
        const { mbid, title, artist, genre, isMasterPiece } = await req.json();
        await connectDB();

        const genreArray = Array.isArray(genre) ? genre : [genre];

        const newMusic = new Music({ mbid, title, artist, genre: genreArray, isMasterPiece: isMasterPiece });
        await newMusic.save();

        return NextResponse.json(newMusic);
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

        const music = await Music.find({ delflag: false }).sort({ createdAt: -1 });
        return NextResponse.json(music);
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

        const updatedMusic = await Music.findByIdAndUpdate(
            id,
            { delflag: true },
            { new: true }
        );

        if (!updatedMusic) {
            return NextResponse.json({ error: "Music not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Music has been deleted.", movie: updatedMusic });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to delete music." }, { status: 500 });
    }

}