import { connectDB } from "../../../../../lib/mongodb";
import { Book } from "../../../../../models/Book";
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

        const book = await Book.findById(id);

        if (!book || book.delflag) {
            return NextResponse.json({ error: "Book not found." }, { status: 404 });
        }

        return NextResponse.json(book);
    } catch (error: unknown) {
        console.error("Error fetching book by ID:", error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to fetch book." }, { status: 500 });
    }
}

// 수정
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    const { title, author, genre, isMasterPiece } = await req.json();

    try {
        await connectDB();

        console.log(typeof Book.findById);

        if (!isValidObjectId(id)) {
            return NextResponse.json({ error: "Invalid ID format." }, { status: 400 });
        }

        const genreArray = Array.isArray(genre) ? genre : [genre];

        const updatedBook = await Book.findByIdAndUpdate(
            id,
            {
                ...(title && { title }),
                ...(author && { author }),
                ...(genre && { genre: genreArray }),
                ...(typeof isMasterPiece === "boolean" && { isMasterPiece }),
            },
            { new: true }
        );

        if (!updatedBook) {
            return NextResponse.json({ error: "Book not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Book updated successfully.", book: updatedBook });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to update book." }, { status: 500 });
    }
}