"use client"

import Link from "next/link";
import {Series} from "../../types/series";
import Spinner from "@/components/common/Spinner";
import Pagination from "@/components/common/Pagination";
import useUserStore from "../../store/userStore";
import React, {useEffect, useRef, useState} from "react";

interface SeriesListProps {
    initialSeries: Series[];
}

function SeriesList({ initialSeries }: SeriesListProps) {

    const user = useUserStore((state) => state.user);
    const setLoading = useUserStore((state) => state.setLoading);
    const loading = useUserStore((state) => state.loading);
    const [seriesList, setSeriesList] = useState<Series[]>(initialSeries);
    const [error, setError] = useState("");

    const [ currentPage, setCurrentPage ] = useState(1);
    const itemsPerPage = 5;

    const [isOpen, setIsOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const modalRef = useRef<HTMLDivElement | null>(null);
    const toggleComment = (seriesId: string) => {
        setExpandedId(prev => (prev === seriesId ? null : seriesId));
    };

    useEffect(() => {
        setLoading(false);
        fetchSeriesList();
    }, []);

    const totalPages = Math.ceil(seriesList.length / itemsPerPage);
    const displayedSeries = seriesList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const openModal = (event: React.MouseEvent, seriesId: string) => {
        setIsOpen(true);
        setSelectedSeriesId(seriesId);
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setModalPosition({
            x: rect.left - 150, // 버튼 왼쪽으로 약간 이동
            y: rect.bottom + 5, // 버튼 아래에 여백 추가
        });
    };

    const closeModal = () => setIsOpen(false);

    const handleDelete = async () => {
        if (!selectedSeriesId) return;

        try {
            const response = await fetch(`/api/series`, {
                method: "PUT", // PUT 요청을 사용
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: selectedSeriesId }),
            });

            if (!response.ok) throw new Error("Failed to delete series");

            alert("Series successfully deleted");
            // 삭제된 시리즈를 목록에서 제거
            await fetchSeriesList();
            closeModal();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    const fetchSeriesList = async () => {
        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${baseUrl}/api/series`);
            if (!response.ok) {
                throw new Error(`Failed to fetch series: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setSeriesList(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching series:", error);
            setError("Failed to fetch series from API");
            setLoading(false);
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
                <Link href="/series/add">
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
                        {displayedSeries.map((series, index) => (
                            <li
                                key={index}
                                className="flex flex-col justify-between h-full p-4 border border-gray-300 rounded-lg shadow-sm"
                                onClick={() => toggleComment(series._id)}
                            >
                                <div className="flex items-start justify-between space-x-4">
                                    {series.posterPath && (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w92${series.posterPath}`}
                                            alt={`${series.name} poster`}
                                            className="w-14 h-auto rounded"
                                        />
                                    )}
                                    <div className="flex-grow">
                                        <p className="font-bold">{series.name}</p>
                                        <p className="text-gray-600">{series.broadcaster}</p>
                                    </div>
                                    {!loading && user && (
                                        <button
                                            className="text-gray-500 hover:text-gray-800 font-bold text-xl"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                openModal(event, series._id);
                                            }}
                                        >
                                            ⋮
                                        </button>
                                    )}
                                </div>
                                {/* comment: 항상 하단에 위치 */}
                                <div
                                    className={`mt-auto overflow-hidden transition-all duration-300 ease-in-out ${
                                        expandedId === series._id ? "max-h-40 pt-4" : "max-h-0 p-0"
                                    } text-gray-700 text-sm`}
                                >
                                    {expandedId === series._id && (
                                        <p className="text-gray-500">
                                            {series.comment || "No comments available."}
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
                    <Link href={`/series/update/${selectedSeriesId}`} className="block w-full text-left p-2">
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

export default SeriesList;