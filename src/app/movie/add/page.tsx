"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function AddMoviePage() {
    const [formData, setFormData] = useState({
        title: "",
        director: "",
        genre: "",
        comment: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let reviewId = null;

            // 리뷰가 입력된 경우에만 리뷰 추가 요청
            if (formData.comment.trim() !== "") {
                const reviewResponse = await fetch("/api/review", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ comment: formData.comment }),
                });

                if (!reviewResponse.ok) throw new Error("리뷰 추가 실패");
                const reviewData = await reviewResponse.json();
                reviewId = reviewData._id; // 생성된 리뷰 ID 저장
            }

            // 영화 추가 요청 (리뷰 ID는 있을 때만 포함)
            const movieResponse = await fetch("/api/movie", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title,
                    director: formData.director,
                    genre: formData.genre,
                    reviewId, // 리뷰가 없으면 null이 들어감
                }),
            });

            if (!movieResponse.ok) throw new Error("fail to add movie");

            alert("successfully added movie");

            // 폼 초기화
            setFormData({ title: "", director: "", genre: "", comment: "" });

            // 자동으로 movie 페이지로 이동
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
                    name="director"
                    placeholder="director"
                    value={formData.director}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-black"
                    required
                />
                <input
                    type="text"
                    name="genre"
                    placeholder="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-black"
                    required
                />
                <textarea
                    name="comment"
                    placeholder="review"
                    value={formData.comment}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-black"
                />
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