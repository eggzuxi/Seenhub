import {connectDB} from "../../../../lib/mongodb";
import {Book} from "../../../../models/Book";
import {NextResponse} from "next/server";

// 추가
export async function POST(req: Request) {
    try {
        const { title, author, genre } = await req.json();
        await connectDB();

        const newBook = new Book({ title, author, genre });
        await newBook.save();

        return NextResponse.json(newBook);
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

        const books = await Book.find(); // 모든 책 조회
        return NextResponse.json(books);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "데이터 조회 실패" }, { status: 500 });
    }
}