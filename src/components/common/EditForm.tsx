"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Music } from "../../../types/music";
import { Movie } from "../../../types/movie";
import { Book } from "../../../types/book";
import { Series } from "../../../types/series";

type ItemType = "book" | "music" | "series" | "movie";

const genreOptions = {
    book: ["Fiction", "Non-Fiction", "Mystery", "Thriller", "Romance", "Fantasy", "SF", "Horror", "Adventure", "Historical Fiction", "Biography", "Autobiography", "Self-Help", "Health & Wellness", "Psychology", "Philosophy", "Science", "Business", "Politics", "Religion & Spirituality", "Cookbook", "Educational"],
    music: ["Pop", "Rock", "Metal", "Hiphop", "Jazz", "Indie", "Classic", "Dance", "J-Pop", "R&B", "Soul", "Ballad"],
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
                    className="w-full p-2 border rounded text-black"
                    placeholder="MBID"
                />
            )}

            <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded text-black"
                placeholder="Title"
                required
            />

            {type === "book" && (
                <input
                    type="text"
                    name="author"
                    value={(formData as Book).author}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-black"
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
                    className="w-full p-2 border rounded text-black"
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
                    className="w-full p-2 border rounded text-black"
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
                        className="w-full p-2 border rounded text-black"
                        placeholder="Director"
                        required
                    />
                </>
            )}

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

            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                UPDATE
            </button>
        </form>
    );
}

export default EditForm;