"use client"

import Link from "next/link";
import {Series} from "../../types/series";
import Spinner from "@/components/common/Spinner";
import Pagination from "@/components/common/Pagination";
import useUserStore from "../../store/userStore";
import {useEffect, useRef, useState} from "react";

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

    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setLoading(false);
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
            setSeriesList((prevSeries) => prevSeries.filter((series) => series._id !== selectedSeriesId));
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
                <Link href="/series/add">
                    <button className="mb-5 bg-gray-500 text-white font-bold px-4 py-2 rounded">
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
                            <li key={index}
                                className="flex justify-items-start items-center p-4 border border-gray-300 rounded-lg shadow-sm">
                                <div>
                                    <p className="font-bold">{series.title}</p>
                                    <p className="text-gray-600">{series.broadcaster}</p>
                                </div>
                                <div className="ml-auto">
                                    {!loading && user && (
                                        <button
                                            className="text-gray-500 hover:text-gray-200 font-bold text-xl"
                                            onClick={(event) => openModal(event, series._id)}
                                        >
                                            ⋮
                                        </button>
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
                    style={{top: modalPosition.y, left: modalPosition.x}}
                >
                    <button className="block w-full text-left p-2" onClick={closeModal}>
                        수정
                    </button>
                    <button className="block w-full text-left p-2 text-red-500" onClick={handleDelete}>
                        삭제
                    </button>
                </div>
            )}

        </div>
    );
}

export default SeriesList;