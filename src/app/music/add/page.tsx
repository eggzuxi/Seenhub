"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "../../../../store/userStore";

const genres = ["Pop", "Rock", "Metal", "Hiphop", "Jazz", "Indie", "Classic", "Dance", "J-Pop", "R&B", "Soul", "Ballad"];

function AddMusicPage() {

    const [formData, setFormData] = useState({
        mbid: "",
        title: "",
        artist: "",
        genre: [] as string[],
    });
    const setLoading = useUserStore((state) => state.setLoading);
    const loading = useUserStore((state) => state.loading);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            genre: checked ? [...prev.genre, value] : prev.genre.filter((g) => g !== value),
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {

            // 음악 추가 요청 (리뷰 ID는 있을 때만 포함)
            const musicResponse = await fetch("/api/music", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mbid: formData.mbid,
                    title: formData.title,
                    artist: formData.artist,
                    genre: formData.genre,
                }),
            });

            if (!musicResponse.ok) throw new Error("fail to add music");

            alert("successfully added music");

            // 폼 초기화
            setFormData({ mbid: "", title: "", artist: "", genre: [] });

            // 자동으로 music 페이지로 이동
            router.push("/music");
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

    return (
        <div className="container p-10">
            <h1 className="text-2xl font-bold mb-4">Add music</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="mbid"
                    placeholder="mbid"
                    value={formData.mbid}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-black"
                />
                <input
                    type="text"
                    name="title"
                    placeholder="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-black"
                    required
                />
                <input
                    type="text"
                    name="artist"
                    placeholder="artist"
                    value={formData.artist}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-black"
                    required
                />
                <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                        <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                value={genre}
                                checked={formData.genre.includes(genre)}
                                onChange={handleGenreChange}
                                className="w-4 h-4 border border-gray-400 rounded-sm bg-transparent accent-white"
                            />
                            <span>{genre}</span>
                        </label>
                    ))}
                </div>
                <button
                    type="submit"
                    className="w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
                    disabled={loading}
                >
                    {loading ? "adding..." : "ADD"}
                </button>
            </form>
        </div>
    );
}

export default AddMusicPage;