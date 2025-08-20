"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Music } from "../../../types/music";
import { Movie } from "../../../types/movie";
import { Book } from "../../../types/book";
import { Series } from "../../../types/series";

type ItemType = "book" | "music" | "series" | "movie";

const genreOptions = {
    music: ["Pop", "Rock", "Metal", "Electronica", "Rap", "Hiphop", "Jazz", "Indie", "Fork", "Blues", "Classic", "Dance", "J-Pop", "R&B", "Soul", "Ballad"],
    movie: ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Science Fiction", "TV Movie", "Thriller", "War", "Western"],
    series: ["Action & Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Kids", "Mystery", "News", "Reality", "Sci-Fi & Fantasy", "Soap", "Talk", "War & Politics", "Western"],
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

        const currentFormData = formData as Music | Series | Movie;

        const { value, checked } = e.target;
        const currentGenre = Array.isArray(currentFormData.genres)
            ? currentFormData.genres
            : currentFormData.genres?.split?.(",") || [];

        const updatedGenre = checked
            ? [...currentGenre, value]
            : currentGenre.filter((g) => g !== value);

        setFormData((prev) => ({ ...prev, genres: updatedGenre as any }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${apiEndpoints[type]}/${formData.id}`, {
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
                    value={(formData as Series).title}
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
                    value={(formData as Book).publisher}
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
                    value={(formData as Series).rating}
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
                        value={(formData as Movie).rating}
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
                    value={formData.commentId}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="Comment"
                />
            </div>

            {type !== "book" && (
                <div className="flex flex-wrap gap-2">
                    {genreOptions[type].map((g) => (
                        <label key={g} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                value={g}
                                checked={(formData as Music | Movie | Series).genres.includes(g)}
                                onChange={handleGenreChange}
                                className="w-4 h-4 border border-gray-400 rounded-sm bg-transparent accent-white"
                            />
                            <span>{g}</span>
                        </label>
                    ))}
                </div>
            )}

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