"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {Music} from "../../../types/music";

function Page() {
    const [musicList, setMusicList] = useState<Music[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMusic = async () => {
            try {
                const response = await fetch("/api/music");
                if (!response.ok) throw new Error("Failed to fetch music data");
                const data = await response.json();
                setMusicList(data);
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
        fetchMusic();
    }, []);

    return (
        <div className="container p-10">
            <Link href="/music/add">
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
                        <th className="border border-gray-300 p-2">Artist</th>
                        <th className="border border-gray-300 p-2">Genre</th>
                    </tr>
                    </thead>
                    <tbody>
                    {musicList.map((music, index) => (
                        <tr key={index} className="text-center">
                            <td className="border border-gray-300 p-2">{index + 1}</td>
                            <td className="border border-gray-300 p-2">{music.title}</td>
                            <td className="border border-gray-300 p-2">{music.artist}</td>
                            <td className="border border-gray-300 p-2">{music.genre}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Page;