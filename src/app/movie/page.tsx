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
            <Link href="/movie/add">
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
                        <th className="border border-gray-300 p-2">Director</th>
                        <th className="border border-gray-300 p-2">Genre</th>
                    </tr>
                    </thead>
                    <tbody>
                    {movieList.map((movie, index) => (
                        <tr key={index} className="text-center">
                            <td className="border border-gray-300 p-2">{index + 1}</td>
                            <td className="border border-gray-300 p-2">{movie.title}</td>
                            <td className="border border-gray-300 p-2">{movie.director}</td>
                            <td className="border border-gray-300 p-2">{movie.genre}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Page;