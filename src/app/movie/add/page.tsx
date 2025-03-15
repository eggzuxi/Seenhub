"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { searchMovie, getMoviePosterUrl } from "@/app/api/movie/tmdb";

const genres = ["Romance", "Anime", "Action", "SF", "Drama", "Adventure", "Horror", "Fantasy", "Comedy", "Thriller", "Mystery"];

function AddMoviePage() {
    const [formData, setFormData] = useState({
        title: "",
        director: "",
        genre: [] as string[],
        posterPath: "", // 추가: 포스터 경로 저장
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchResults, setSearchResults] = useState<{ id: number; title: string; poster_path: string | null }[]>([]);
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

    const handleSearch = async () => {
        if (!formData.title.trim()) return;
        setLoading(true);
        setSearchResults([]);
        setError("");

        try {
            const data = await searchMovie(formData.title);
            if (data) {
                setSearchResults(data.slice(0, 5)); // 최대 5개 결과만 표시
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to fetch movies");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSelectMovie = (movie: { id: number; title: string; poster_path: string | null }) => {
        setFormData({
            ...formData,
            title: movie.title,
            posterPath: movie.poster_path || "", // 선택한 영화의 포스터 경로 저장
        });
        setSearchResults([]); // 검색 결과 숨김

        console.log(movie);

    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const movieResponse = await fetch("/api/movie", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title,
                    director: formData.director,
                    genre: formData.genre,
                    posterPath: formData.posterPath, // 포스터 경로 추가
                }),
            });

            if (!movieResponse.ok) throw new Error("fail to add movie");

            alert("successfully added movie");

            setFormData({ title: "", director: "", genre: [], posterPath: "" }); // posterPath 초기화

            router.push("/movie");
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
            <h1 className="text-2xl font-bold mb-4">Add movie</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        name="title"
                        placeholder="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-black"
                        required
                    />
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? "Searching..." : "Search"}
                    </button>
                </div>

                {/* 검색 결과 표시 */}
                {searchResults.length > 0 && (
                    <div className="border p-2 rounded bg-gray-100">
                        <h2 className="text-lg text-black font-semibold mb-2">Search Results</h2>
                        <ul className="space-y-2">
                            {searchResults.map((movie, index) => (
                                <li key={index} className="flex items-center space-x-4 cursor-pointer" onClick={() => handleSelectMovie(movie)}>
                                    {movie.poster_path ? (
                                        <img
                                            src={getMoviePosterUrl(movie.poster_path, "w92")}
                                            alt={movie.title}
                                            className="w-16 h-auto rounded"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-300 flex items-center justify-center rounded">
                                            ❌
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-black font-medium">{movie.title}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <input
                    type="text"
                    name="director"
                    placeholder="director"
                    value={formData.director}
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

export default AddMoviePage;