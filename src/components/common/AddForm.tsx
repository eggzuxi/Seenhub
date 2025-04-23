"use client"

import {useState} from "react";
import useUserStore from "../../../store/userStore";
import {useRouter} from "next/navigation";
import AuthGuard from "@/components/common/AuthGuard";
import {searchBook} from "@/app/api/book/kakao";

const genreOptions = {
    book: ["Fiction", "Non-Fiction", "Mystery", "Thriller", "Romance", "Fantasy", "SF", "Horror", "Adventure", "Historical Fiction", "Biography", "Autobiography", "Self-Help", "Health & Wellness", "Psychology", "Philosophy", "Science", "Business", "Politics", "Religion & Spirituality", "Cookbook", "Educational"],
    music: ["Pop", "Rock", "Metal", "Electronica", "Hiphop", "Jazz", "Indie", "Classic", "Dance", "J-Pop", "R&B", "Soul", "Ballad"],
    series: ["Drama", "Animation", "Comedy", "Action", "Thriller", "SF", "Fantasy", "Romance", "Documentary", "Disaster", "Horror"],
};

const apiEndpoints = {
    book: "/api/book",
    music: "/api/music",
    series: "/api/series",
};

type ItemType = "book" | "music" | "series";

interface AddItemPageProps {
    type: ItemType;
}

interface BookSearchResult {
    title: string;
    thumbnail: string;
    authors: string[];
}

function AddForm({ type }: AddItemPageProps) {
    const initialFormState = {
        title: "",
        author: "", // 초기 상태 수정
        artist: "", // 초기 상태 수정
        broadcaster: "", // 초기 상태 수정
        genre: [] as string[],
        isMasterPiece: false,
        thumbnail: "",
        ...(type === "music" && { mbid: "" }),
    };

    const [formData, setFormData] = useState(initialFormState);
    const setLoading = useUserStore((state) => state.setLoading);
    const loading = useUserStore((state) => state.loading);
    const [error, setError] = useState("");
    const router = useRouter();
    const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]); // State for Kakao search results

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleSearchBook = async () => {
        if (type === "book" && !formData.title.trim()) {
            return;
        }
        setLoading(true);
        setSearchResults([]);
        setError("");

        try {
            if (type === "book") {
                const data = await searchBook(formData.title);
                if (data) {
                    setSearchResults(data.slice(0, 5)); // Display up to 5 results
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
        setSearchResults([]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            console.log("FormData:", formData);

            let requestData: {
                mbid?: string;
                title: string;
                author?: string;
                artist?: string;
                broadcaster?: string;
                genre: string[];
                thumbnail?: string;
            } = {
                title: formData.title,
                genre: formData.genre,
            };

            if (type === "book") {
                requestData = { title: formData.title, author: formData.author, genre: formData.genre, thumbnail: formData.thumbnail };
            } else if (type === "music") {
                requestData = { mbid: formData.mbid, title: formData.title, artist: formData.artist, genre: formData.genre };
            } else if (type === "series") {
                requestData = { title: formData.title, broadcaster: formData.broadcaster, genre: formData.genre };
            }

            const response = await fetch(apiEndpoints[type], {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
        <AuthGuard>
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
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    {type === "book" && (
                        <button
                            type="button"
                            onClick={handleSearchBook}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    )}

                    {/* Book Search Results */}
                    {type === "book" && searchResults.length > 0 && (
                        <div className="border p-2 rounded bg-gray-100">
                            <h2 className="text-lg text-black font-semibold mb-2">Search Results</h2>
                            <ul className="space-y-2">
                                {searchResults.map((book, index) => (
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

                    <input
                        key={type === "music" ? "artist" : type === "book" ? "author" : "broadcaster"}
                        type="text"
                        name={type === "music" ? "artist" : type === "book" ? "author" : "broadcaster"}
                        placeholder={type === "music" ? "Artist" : type === "book" ? "Author" : "Broadcaster"}
                        value={type === "music" ? formData.artist : type === "book" ? formData.author : formData.broadcaster}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <div className="flex flex-wrap gap-2">
                        {genreOptions[type].map((genre) => (
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
        </AuthGuard>
    );
}

export default AddForm;