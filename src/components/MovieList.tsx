"use client"

import Link from "next/link";
import {Movie} from "../../types/movie";
import Spinner from "@/components/common/Spinner";
import useUserStore from "../../store/userStore";
import React, {useEffect, useRef, useState} from "react";

interface MovieListProps {
    initialMovies: Movie[];
    isLastPage: boolean;
}

function MovieList({ initialMovies, isLastPage: initialIsLastPage }: MovieListProps) {

    const user = useUserStore((state) => state.user);
    const setLoading = useUserStore((state) => state.setLoading);
    const loading = useUserStore((state) => state.loading);

    const [movieList, setMovieList] = useState<Movie[]>(initialMovies);
    const [error, setError] = useState("");
    const [ currentPage, setCurrentPage ] = useState(0);
    const [isLastPage, setIsLastPage] = useState(initialIsLastPage);
    const itemsPerPage = 5;

    const [isOpen, setIsOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const modalRef = useRef<HTMLDivElement | null>(null);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const toggleComment = (movieId: string) => {
        setExpandedId(prev => (prev === movieId ? null : movieId));
    };

    const openModal = (event: React.MouseEvent, movieId: string) => {
        setIsOpen(true);
        setSelectedMovieId(movieId);
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setModalPosition({
            x: rect.left - 150,
            y: rect.bottom + 5,
        });
    };

    const closeModal = () => setIsOpen(false);

    const handleDelete = async () => {
        if (!selectedMovieId) return;

        try {
            const response = await fetch(`/api/movie/${selectedMovieId}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Failed to delete movie");

            alert("Movie successfully deleted");

            setMovieList([]);
            setCurrentPage(0);
            setIsLastPage(false);
            setLoading(true);
            closeModal();

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    const fetchMovieList = async (page: number) => {
        try {
            const response = await fetch(`/api/movie?page=${page}&size=${itemsPerPage}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch movie: ${ response.status } ${ response.statusText }`);
            }
            const data = await response.json();
            setMovieList(prevList => [...prevList, ...data.content]);
            setIsLastPage(data.last);
        } catch (error) {
            console.error("Error fetching movie:", error);
            setError("Failed to fetch movie from API");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && !isLastPage) {
                    setCurrentPage(prevPage => prevPage + 1);
                }
            },
            { threshold: 1.0 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [loading, isLastPage]);

    useEffect(() => {

        if (currentPage > 0 || (currentPage === 0 && initialMovies.length === 0)) {
            fetchMovieList(currentPage);
        }
    }, [currentPage]);

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
                        {movieList.map((movie, index) => (
                            <li
                                key={index}
                                className="flex flex-col justify-between h-full p-4 border border-gray-300 rounded-lg shadow-sm"
                                onClick={() => toggleComment(movie.id)}
                            >
                                <div className="flex items-start justify-between space-x-4">
                                    <img
                                        src={movie.thumbnail}
                                        alt={movie.title}
                                        className="w-14 h-auto rounded"
                                    />
                                    <div className="flex-grow">
                                        <p className="font-bold">{movie.title}</p>
                                        <p className="text-gray-600">⭐ {movie.rating}</p>
                                    </div>
                                    {!loading && user && (
                                        <button
                                            className="text-gray-500 hover:text-gray-800 font-bold text-xl"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                openModal(event, movie.id);
                                            }}
                                        >
                                            ⋮
                                        </button>
                                    )}
                                </div>
                                {/* comment: 항상 하단에 위치 */}
                                <div
                                    className={`mt-auto overflow-hidden transition-all duration-300 ease-in-out ${
                                        expandedId === movie.id ? "max-h-40 pt-4" : "max-h-0 p-0"
                                    } text-gray-700 text-sm`}
                                >
                                    {expandedId === movie.id && (
                                        <p className="text-gray-500">
                                            {movie.commentId || "No comments available."}
                                        </p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div ref={loaderRef} className="flex justify-center my-4">
                        {loading && <p>Loading more movie...</p>}
                    </div>
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