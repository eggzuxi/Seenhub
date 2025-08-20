"use client";

import React, { useState } from "react";
import useUserStore from "../../../store/userStore";
import { useRouter } from "next/navigation";

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

type ItemType = "book" | "music" | "series" | "movie";

interface AddItemPageProps {
    type: ItemType;
}

interface MusicSearchResult {
    title: string;
    artist: string;
    thumbnail: string;
}

interface MovieSearchResult {
    title: string;
    genres: string[];
    rating: number;
    thumbnail: string;
}

interface BookSearchResult {
    title: string;
    authors: string[];
    publisher: string;
    thumbnail: string;
}

interface SeriesSearchResult {
    title: string;
    genres: string[];
    rating: number;
    thumbnail: string;
}

function AddForm({ type }: AddItemPageProps) {
    const initialFormState = {
        title: "",
        authors: [] as string[],
        artist: "",
        rating: 0,
        genres: [] as string[],
        publisher: "",
        commentId: "",
        thumbnail: "",
        isMasterPiece: false,
    };

    const [formData, setFormData] = useState(initialFormState);
    const setLoading = useUserStore((state) => state.setLoading);
    const loading = useUserStore((state) => state.loading);
    const [error, setError] = useState("");
    const router = useRouter();
    const [bookSearchResults, setBookSearchResults] = useState<BookSearchResult[]>([]);
    const [musicSearchResults, setMusicSearchResults] = useState<MusicSearchResult[]>([]);
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
            genres: checked ? [...prev.genres, value] : prev.genres.filter((g) => g !== value),
        }));
    };

    // Book 검색
    const searchBook = async (title: string) : Promise<BookSearchResult[]> => {
        const res = await fetch(`/api/book?query=${encodeURIComponent(title)}`);
        if (!res.ok) {
            throw new Error("Failed to fetch book search results");
        }
        return res.json();
    }

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
            publisher: book.publisher,
            thumbnail: book.thumbnail || "",
        });
        setBookSearchResults([]);
    };

    // Music 검색
    const searchMusic = async (title: string) : Promise<MusicSearchResult[]> => {
        const res = await fetch(`/api/music?query=${encodeURIComponent(title)}`);
        if (!res.ok) {
            throw new Error("Failed to fetch music search results");
        }
        return res.json();
    }

    const handleSearchMusic = async () => {
        if (type === "music" && !formData.title.trim()) {
            return;
        }
        setLoading(true);
        setMusicSearchResults([]);
        setError("");

        try {
            if (type === "music") {
                const data = await searchMusic(formData.title);
                if (data) {
                    setMusicSearchResults(data.slice(0, 5));
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to fetch music");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSelectMusic = (music: MusicSearchResult) => {
        setFormData({
            ...formData,
            title: music.title,
            thumbnail: music.thumbnail || "",
        });
        setMusicSearchResults([]);
    };

    // Movie 검색
    const searchMovie = async (title: string): Promise<MovieSearchResult[]> => {
        const res = await fetch(`/api/movie?query=${encodeURIComponent(title)}`);
        if (!res.ok) {
            throw new Error("Failed to fetch movie search results");
        }
        return res.json();
    };

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
            thumbnail: movie.thumbnail || "",
        });
        setMovieSearchResults([]);
    };

    // Series 검색
    const searchSeries = async (title: string): Promise<SeriesSearchResult[]> => {
        const res = await fetch(`/api/series?query=${encodeURIComponent(title)}`);
        if (!res.ok) {
            throw new Error("Failed to fetch series search results");
        }
        return res.json();
    };

    const handleSearchSeries = async () => {
        if (type === "series" && !formData.title.trim()) {
            return;
        }
        setLoading(true);
        setSeriesSearchResults([]);
        setError("");

        try {
            if (type === "series") {
                const data = await searchSeries(formData.title);
                if (data) {
                    setSeriesSearchResults(data.slice(0, 5));
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
            title: series.title,
            thumbnail: series.thumbnail || "",
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

            const requestData = {
                title: formData.title,
                authors: formData.authors,
                artist: formData.artist,
                rating: formData.rating,
                publisher: formData.publisher,
                genres: formData.genres,
                commentId: formData.commentId,
                thumbnail: formData.thumbnail,
                isMasterPiece: formData.isMasterPiece,
            };

            if (type === "book") {
                requestData.authors = formData.authors;
                requestData.publisher = formData.publisher;
            } else if (type === "music") {
                requestData.artist = formData.artist;
            } else if (type === "series") {
                requestData.genres = formData.genres;
                requestData.rating = formData.rating;
            } else if (type === "movie") {
                requestData.genres = formData.genres;
                requestData.rating = formData.rating;
            }

            console.log("API Request Data:", requestData);
            console.log("API Endpoint:", apiEndpoints[type]);

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
                <div className="flex space-x-2">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <button
                        type="button"
                        onClick={
                            type === "book" ? handleSearchBook :
                            type === "music" ? handleSearchMusic :
                            type === "movie" ? handleSearchMovie : handleSearchSeries
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? "Searching..." : "Search"}
                    </button>
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
                                            ❌
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-black font-medium">{book.title}</p>
                                        <p className="text-gray-600 text-sm">Author: {book.authors.join(", ")}</p>
                                        <p className="text-gray-600 text-sm">{book.publisher}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Music Search Results */}
                {type === "music" && musicSearchResults.length > 0 && (
                    <div className="border p-2 rounded bg-gray-100">
                        <h2 className="text-lg text-black font-semibold mb-2">Search Results</h2>
                        <ul className="space-y-2">
                            {musicSearchResults.map((music, index) => (
                                <li
                                    key={index}
                                    className="flex items-center space-x-4 cursor-pointer"
                                    onClick={() => handleSelectMusic(music)}
                                >
                                    {music.thumbnail ? (
                                        <img
                                            src={music.thumbnail}
                                            alt={music.title}
                                            className="w-16 h-auto rounded"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-300 flex items-center justify-center rounded">
                                            ❌
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-black font-medium">{music.title}</p>
                                        <p className="text-gray-600 text-sm">Artist: {music.artist}</p>
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
                                    {movie.thumbnail ? (
                                        <img
                                            src={movie.thumbnail}
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
                                    {series.thumbnail ? (
                                        <img
                                            src={series.thumbnail}
                                            alt={series.title}
                                            className="w-16 h-auto rounded"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-300 flex items-center justify-center rounded">
                                            ❌
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-black font-medium">{series.title}</p>
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
                        value={formData.authors}
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
                {type === "series" || type === "movie" && (
                    <input
                        type="text"
                        name="rating"
                        placeholder="Rating"
                        value={formData.rating}
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
                        value={formData.commentId}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {genreOptions[type]?.map((genres: string) => (
                        <label key={genres} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                value={genres}
                                checked={formData.genres.includes(genres)}
                                onChange={handleGenreChange}
                                className="w-4 h-4 border border-gray-400 rounded-sm bg-transparent accent-white"
                            />
                            <span>{genres}</span>
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