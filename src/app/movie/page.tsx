"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {Movie} from "../../../types/movie";

function Page() {
    const [movieList, setMovieList] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await fetch("/api/movie");
                if (!response.ok) throw new Error("Failed to fetch movie data");
                const data = await response.json();
                setMovieList(data);
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
        fetchMovie();
    }, []);

    return (
        <div className="container p-10">
            <Link href="/book/add">
                <button className="mb-5 bg-gray-500 text-white font-bold px-4 py-2 rounded">ADD</button>
            </Link>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <ul className="space-y-4">
                    {movieList.map((movie, index) => (
                        <li key={index}
                            className="flex justify-between items-center p-4 border border-gray-300 rounded-lg shadow-sm">
                            <div>
                                <p className="font-bold">{movie.title}</p>
                                <p className="text-gray-600">{movie.director} - {movie.genre}</p>
                            </div>
                            <button className="text-gray-500 hover:text-gray-200 font-bold text-xl">⋮</button>
                            {/* 삭제 기능은 나중에 추가 */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Page;