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
            <Link href="/book/add">
                <button className="mb-5 bg-gray-500 text-white font-bold px-4 py-2 rounded">ADD</button>
            </Link>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <ul className="space-y-4">
                    {musicList.map((music, index) => (
                        <li key={index}
                            className="flex justify-between items-center p-4 border border-gray-300 rounded-lg shadow-sm">
                            <div>
                                <p className="font-bold">{music.title}</p>
                                <p className="text-gray-600">{music.artist} - {music.genre}</p>
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