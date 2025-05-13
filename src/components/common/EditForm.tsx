"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Music } from "../../../types/music";
import { Movie } from "../../../types/movie";
import { Book } from "../../../types/book";
import { Series } from "../../../types/series";

type ItemType = "book" | "music" | "series" | "movie";

const genreOptions = {
    book: ["Fiction", "Non-Fiction", "Mystery", "Thriller", "Romance", "Fantasy", "SF", "Horror", "Adventure", "Historical Fiction", "Biography", "Autobiography", "Self-Help", "Health & Wellness", "Psychology", "Philosophy", "Science", "Business", "Politics", "Religion & Spirituality", "Cookbook", "Educational"],
    music: ["Pop", "Rock", "Metal", "Electronica", "Hiphop", "Jazz", "Indie", "Classic", "Dance", "J-Pop", "R&B", "Soul", "Ballad"],
    series: ["Drama", "Animation", "Comedy", "Action", "Thriller", "SF", "Fantasy", "Romance", "Documentary", "Disaster", "Horror"],
    movie: ["Romance", "Anime", "Action", "SF", "Drama", "Adventure", "Horror", "Fantasy", "Comedy", "Thriller", "Mystery"],
};

const apiEndpoints = {
    book: "/api/book",
    music: "/api/music",
    series: "/api/series",
    movie: "/api/movie",
};

interface EditFormProps<T> {
    type: ItemType;
    initialData: T;
}

function EditForm<T extends Book | Music | Series | Movie>({ type, initialData }: EditFormProps<T>) {
    const [formData, setFormData] = useState<T>(initialData);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const currentGenre = Array.isArray(formData.genre)
            ? formData.genre
            : formData.genre?.split?.(",") || [];

        const updatedGenre = checked
            ? [...currentGenre, value]
            : currentGenre.filter((g) => g !== value);

        setFormData((prev) => ({ ...prev, genre: updatedGenre as any }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${apiEndpoints[type]}/${formData._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error("Failed to update data.");
            }

            alert("Complete to update data.");
            router.push(`/${type}`);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
            {type === "music" && (
                <input
                    type="text"
                    name="mbid"
                    value={(formData as Music).mbid}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="MBID"
                />
            )}

            {type === "book" && (
                <input
                    type="text"
                    name="title"
                    value={(formData as Book).title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="Title"
                    required
                />
            )}

            {type === "music" && (
                <input
                    type="text"
                    name="title"
                    value={(formData as Music).title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="Title"
                    required
                />
            )}

            {type === "series" && (
                <input
                    type="text"
                    name="name"
                    value={(formData as Series).name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="Name"
                    required
                />
            )}

            {type === "movie" && (
                <input
                    type="text"
                    name="title"
                    value={(formData as Movie).title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="Title"
                    required
                />
            )}

            {type === "book" && (
                <input
                    type="text"
                    name="author"
                    value={(formData as Book).author}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="Author"
                    required
                />
            )}

            {type === "music" && (
                <input
                    type="text"
                    name="artist"
                    value={(formData as Music).artist}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="Artist"
                    required
                />
            )}

            {type === "series" && (
                <input
                    type="text"
                    name="broadcaster"
                    value={(formData as Series).broadcaster}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="Broadcaster"
                    required
                />
            )}

            {type === "movie" && (
                <>
                    <input
                        type="text"
                        name="director"
                        value={(formData as Movie).director}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Director"
                        required
                    />
                </>
            )}
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="Comment"
                />
            </div>

            <div className="flex flex-wrap gap-2">
                {genreOptions[type].map((g) => (
                    <label key={g} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            value={g}
                            checked={formData.genre.includes(g)}
                            onChange={handleGenreChange}
                            className="w-4 h-4 border border-gray-400 rounded-sm bg-transparent accent-white"
                        />
                        <span>{g}</span>
                    </label>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <span className="font-medium">Masterpiece</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.isMasterPiece}
                        onChange={(e) =>
                            setFormData({ ...formData, isMasterPiece: e.target.checked })
                        }
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-full"></div>
                </label>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                UPDATE
            </button>
        </form>
    );
}

export default EditForm;