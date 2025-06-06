"use client"

import Link from "next/link";
import {Movie} from "../../types/movie";
import Spinner from "@/components/common/Spinner";
import Pagination from "@/components/common/Pagination";
import useUserStore from "../../store/userStore";
import React, {useEffect, useRef, useState} from "react";

interface MovieListProps {
    initialMovies: Movie[];
}

function MovieList({ initialMovies }: MovieListProps) {

    const user = useUserStore((state) => state.user);
    const setLoading = useUserStore((state) => state.setLoading);
    const loading = useUserStore((state) => state.loading);
    const [movieList, setMovieList] = useState<Movie[]>(initialMovies);
    const [error, setError] = useState("");

    const [ currentPage, setCurrentPage ] = useState(1);
    const itemsPerPage = 5;

    const [isOpen, setIsOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const modalRef = useRef<HTMLDivElement | null>(null);
    const toggleComment = (movieId: string) => {
        setExpandedId(prev => (prev === movieId ? null : movieId));
    };

    useEffect(() => {
        setLoading(false);
    }, []);

    const totalPages = Math.ceil(movieList.length / itemsPerPage);
    const displayedMovie = movieList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const openModal = (event: React.MouseEvent, movieId: string) => {
        setIsOpen(true);
        setSelectedMovieId(movieId);
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setModalPosition({
            x: rect.left - 150, // 버튼 왼쪽으로 약간 이동
            y: rect.bottom + 5, // 버튼 아래에 여백 추가
        });
    };

    const closeModal = () => setIsOpen(false);

    const handleDelete = async () => {
        if (!selectedMovieId) return;

        try {
            const response = await fetch(`/api/movie`, {
                method: "PUT", // PUT 요청을 사용
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: selectedMovieId }),
            });

            if (!response.ok) throw new Error("Failed to delete movie");

            alert("Movie successfully deleted");
            // 삭제된 영화를 목록에서 제거
            setMovieList((prevMovies) => prevMovies.filter((movie) => movie._id !== selectedMovieId));
            closeModal();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                closeModal();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="container p-10">
            {!loading && user && (
                <Link href="/movie/add">
                    <button className="mb-5 bg-blue-400 text-white font-bold px-4 py-2 rounded">
                        ADD
                    </button>
                </Link>
            )}
            {loading && (
                <div className="flex justify-center items-center h-40">
                    <Spinner size={50} color="#3498db"/>
                </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <>
                    <ul className="space-y-4">
                        {displayedMovie.map((movie, index) => (
                            <li
                                key={index}
                                className="flex flex-col justify-between h-full p-4 border border-gray-300 rounded-lg shadow-sm"
                                onClick={() => toggleComment(movie._id)}
                            >
                                <div className="flex items-start justify-between space-x-4">
                                    {movie.posterPath && (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`}
                                            alt={`${movie.title} poster`}
                                            className="w-14 h-auto rounded"
                                        />
                                    )}
                                    <div className="flex-grow">
                                        <p className="font-bold">{movie.title}</p>
                                        <p className="text-gray-600">{movie.director}</p>
                                    </div>
                                    {!loading && user && (
                                        <button
                                            className="text-gray-500 hover:text-gray-800 font-bold text-xl"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                openModal(event, movie._id);
                                            }}
                                        >
                                            ⋮
                                        </button>
                                    )}
                                </div>
                                {/* comment: 항상 하단에 위치 */}
                                <div
                                    className={`mt-auto overflow-hidden transition-all duration-300 ease-in-out ${
                                        expandedId === movie._id ? "max-h-40 pt-4" : "max-h-0 p-0"
                                    } text-gray-700 text-sm`}
                                >
                                    {expandedId === movie._id && (
                                        <p className="text-gray-500">
                                            {movie.comment || "No comments available."}
                                        </p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
                </>
            )}

            {isOpen && (
                <div
                    ref={modalRef}
                    className="absolute bg-black shadow-lg border border-gray-200 rounded-lg p-2 w-40"
                    style={{backgroundColor: 'var(--background)', top: modalPosition.y, left: modalPosition.x}}
                >
                    <Link href={`/movie/update/${selectedMovieId}`} className="block w-full text-left p-2">
                        수정
                    </Link>
                    <button className="block w-full text-left p-2 text-red-500" onClick={handleDelete}>
                        삭제
                    </button>
                </div>
            )}

        </div>
    );
}

export default MovieList;