"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {Book} from "../../../types/book";

function Page() {
    const [bookList, setBookList] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch("/api/book");
                if (!response.ok) throw new Error("Failed to fetch book data");
                const data = await response.json();
                setBookList(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, []);

    return (
        <div className="container p-10">
            <Link href="/book/add">
                <button className="pb-5">ADD</button>
            </Link>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <table className="w-full border-collapse border border-gray-300 mt-4">
                    <thead>
                    <tr className="bg-gray-500">
                        <th className="border border-gray-300 p-2">No.</th>
                        <th className="border border-gray-300 p-2">Title</th>
                        <th className="border border-gray-300 p-2">Author</th>
                        <th className="border border-gray-300 p-2">Genre</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bookList.map((book, index) => (
                        <tr key={index} className="text-center">
                            <td className="border border-gray-300 p-2">{index + 1}</td>
                            <td className="border border-gray-300 p-2">{book.title}</td>
                            <td className="border border-gray-300 p-2">{book.author}</td>
                            <td className="border border-gray-300 p-2">{book.genre}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Page;