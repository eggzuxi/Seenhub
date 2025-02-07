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
        return NextResponse.json({ error: "Failed to add data" }, { status: 500 });
    }
}

// 조회
export async function GET() {
    try {
        await connectDB();

        const books = await Book.find({ delflag: false }); // 모든 책 조회
        return NextResponse.json(books);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to look up data" }, { status: 500 });
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

        const updatedBook = await Book.findByIdAndUpdate(
            id,
            { delflag: true },
            { new: true }
        );

        if (!updatedBook) {
            return NextResponse.json({ error: "Book not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Book has been deleted", book: updatedBook });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
    }

}