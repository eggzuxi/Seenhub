"use client";

import React, { useState } from "react";
import useUserStore from "../../../store/userStore";
import { useRouter } from "next/navigation";
import { searchBook } from "@/app/api/book/kakao";
import { searchMovie, getMoviePosterUrl } from "@/app/api/movie/tmdb";
import { searchSeries, getSeriesPosterUrl } from "@/app/api/series/tmdb";

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

type ItemType = "book" | "music" | "series" | "movie";

interface AddItemPageProps {
    type: ItemType;
}

interface BookSearchResult {
    title: string;
    thumbnail: string;
    authors: string[];
}

interface MovieSearchResult {
    id: number;
    title: string;
    poster_path: string | null;
}

interface SeriesSearchResult {
    id: number;
    name: string;
    poster_path: string | null;
}

function AddForm({ type }: AddItemPageProps) {
    const initialFormState = {
        title: "",
        name: "",
        author: "",
        artist: "",
        broadcaster: "",
        director: "", // 영화 감독
        genre: [] as string[],
        isMasterPiece: false,
        comment: "",
        thumbnail: "",
        posterPath: "", // 영화, 시리즈 포스터 경로
        ...(type === "music" && { mbid: "" }),
    };

    const [formData, setFormData] = useState(initialFormState);
    const setLoading = useUserStore((state) => state.setLoading);
    const loading = useUserStore((state) => state.loading);
    const [error, setError] = useState("");
    const router = useRouter();
    const [bookSearchResults, setBookSearchResults] = useState<BookSearchResult[]>([]);
    const [movieSearchResults, setMovieSearchResults] = useState<MovieSearchResult[]>([]);
    const [seriesSearchResults, setSeriesSearchResults] = useState<SeriesSearchResult[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            genre: checked ? [...prev.genre, value] : prev.genre.filter((g) => g !== value),
        }));
    };

    // Book 검색
    const handleSearchBook = async () => {
        if (type === "book" && !formData.title.trim()) {
            return;
        }
        setLoading(true);
        setBookSearchResults([]);
        setError("");

        try {
            if (type === "book") {
                const data = await searchBook(formData.title);
                if (data) {
                    setBookSearchResults(data.slice(0, 5));
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to fetch books");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSelectBook = (book: BookSearchResult) => {
        setFormData({
            ...formData,
            title: book.title,
            author: book.authors.join(", "),
            thumbnail: book.thumbnail || "",
        });
        setBookSearchResults([]);
    };

    // Movie 검색
    const handleSearchMovie = async () => {
        if (type === "movie" && !formData.title.trim()) {
            return;
        }
        setLoading(true);
        setMovieSearchResults([]);
        setError("");

        try {
            if (type === "movie") {
                const data = await searchMovie(formData.title);
                if (data) {
                    setMovieSearchResults(data.slice(0, 5));
                }
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

    const handleSelectMovie = (movie: MovieSearchResult) => {
        setFormData({
            ...formData,
            title: movie.title,
            posterPath: movie.poster_path || "",
        });
        setMovieSearchResults([]);
    };

    // Series 검색
    const handleSearchSeries = async () => {
        if (type === "series" && !formData.name.trim()) {
            return;
        }
        setLoading(true);
        setSeriesSearchResults([]);
        setError("");

        try {
            if (type === "series") {
                const data = await searchSeries(formData.name);
                if (data) {
                    setSeriesSearchResults(data.map(series => ({
                        id: series.id,
                        name: series.name,
                        poster_path: series.poster_path,
                    })).slice(0, 5));
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to fetch series");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSeries = (series: SeriesSearchResult) => {
        setFormData({
            ...formData,
            name: series.name,
            posterPath: series.poster_path || "",
        });
        setSeriesSearchResults([]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log("handleSubmit 함수가 호출됨!");
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            console.log("FormData:", formData);

            let requestData: {
                mbid?: string;
                title?: string;
                name?: string;
                author?: string;
                artist?: string;
                broadcaster?: string;
                director?: string;
                genre: string[];
                comment?: string;
                thumbnail?: string;
                posterPath?: string;
            } = {
                title: formData.title,
                genre: formData.genre,
            };

            if (type === "book") {
                requestData = {
                    title: formData.title,
                    author: formData.author,
                    genre: formData.genre,
                    thumbnail: formData.thumbnail
                };
            } else if (type === "music") {
                requestData = {
                    mbid: formData.mbid,
                    title: formData.title,
                    artist: formData.artist,
                    genre: formData.genre
                };
            } else if (type === "series") {
                requestData = {
                    name: formData.name,
                    broadcaster: formData.broadcaster,
                    genre: formData.genre,
                    posterPath: formData.posterPath,
                };
            } else if (type === "movie") {
                requestData = {
                    title: formData.title,
                    director: formData.director,
                    genre: formData.genre,
                    posterPath: formData.posterPath
                };
            }

            console.log("API Request Data:", requestData);
            console.log("API Endpoint:", apiEndpoints[type]); // 추가된 로그

            const response = await fetch(apiEndpoints[type], {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`API Error (${type}): ${response.status} ${response.statusText}`, errorText);
                throw new Error(`Failed to add ${type}: ${response.status} ${response.statusText}`);
            }

            alert(`Successfully added ${type}`);
            setFormData(initialFormState);
            router.push(`/${type}`);
        } catch (error) {
            console.error("Client Error:", error);
            setError(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container p-10">
            <h1 className="text-2xl font-bold mb-4">Add {type}</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                {type === "music" && (
                    <input
                        type="text"
                        name="mbid"
                        placeholder="MBID"
                        value={formData.mbid || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                )}
                <div className="flex space-x-2">
                    <input
                        type="text"
                        name={type === "series" ? "name" : "title"} // series는 name 사용
                        placeholder={type === "series" ? "Name" : "Title"}
                        value={type === "series" ? formData.name : formData.title}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {(type === "book" || type === "movie" || type === "series") && (
                        <button
                            type="button"
                            onClick={type === "book" ? handleSearchBook : (type === "movie" ? handleSearchMovie : handleSearchSeries)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    )}
                </div>

                {/* Book Search Results */}
                {type === "book" && bookSearchResults.length > 0 && (
                    <div className="border p-2 rounded bg-gray-100">
                        <h2 className="text-lg text-black font-semibold mb-2">Search Results</h2>
                        <ul className="space-y-2">
                            {bookSearchResults.map((book, index) => (
                                <li
                                    key={index}
                                    className="flex items-center space-x-4 cursor-pointer"
                                    onClick={() => handleSelectBook(book)}
                                >
                                    {book.thumbnail ? (
                                        <img
                                            src={book.thumbnail}
                                            alt={book.title}
                                            className="w-16 h-auto rounded"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-300 flex items-center justify-center rounded">
                                            No Image
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-black font-medium">{book.title}</p>
                                        <p className="text-gray-600 text-sm">Author: {book.authors.join(", ")}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Movie Search Results */}
                {type === "movie" && movieSearchResults.length > 0 && (
                    <div className="border p-2 rounded bg-gray-100">
                        <h2 className="text-lg text-black font-semibold mb-2">Search Results</h2>
                        <ul className="space-y-2">
                            {movieSearchResults.map((movie, index) => (
                                <li
                                    key={index}
                                    className="flex items-center space-x-4 cursor-pointer"
                                    onClick={() => handleSelectMovie(movie)}
                                >
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

                {/* Series Search Results */}
                {type === "series" && seriesSearchResults.length > 0 && (
                    <div className="border p-2 rounded bg-gray-100">
                        <h2 className="text-lg text-black font-semibold mb-2">Search Results</h2>
                        <ul className="space-y-2">
                            {seriesSearchResults.map((series, index) => (
                                <li
                                    key={index}
                                    className="flex items-center space-x-4 cursor-pointer"
                                    onClick={() => handleSelectSeries(series)}
                                >
                                    {series.poster_path ? (
                                        <img
                                            src={getSeriesPosterUrl(series.poster_path, "w92")}
                                            alt={series.name}
                                            className="w-16 h-auto rounded"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-300 flex items-center justify-center rounded">
                                            ❌
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-black font-medium">{series.name}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {type === "book" && (
                    <input
                        type="text"
                        name="author"
                        placeholder="Author"
                        value={formData.author}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                )}
                {type === "music" && (
                    <input
                        type="text"
                        name="artist"
                        placeholder="Artist"
                        value={formData.artist}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                )}
                {type === "series" && (
                    <input
                        type="text"
                        name="broadcaster"
                        placeholder="Broadcaster"
                        value={formData.broadcaster}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                )}
                {type === "movie" && (
                    <input
                        type="text"
                        name="director"
                        placeholder="Director"
                        value={formData.director}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                )}
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        name="comment"
                        placeholder="Comment"
                        value={formData.comment}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {genreOptions[type]?.map((genre) => (
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
                <button
                    type="submit"
                    className="w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
                    disabled={loading}
                >
                    {loading ? `Adding ${type}...` : "ADD"}
                </button>
            </form>
        </div>
    );
}

export default AddForm;