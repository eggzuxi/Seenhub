"use client"

import Link from "next/link";
import {Music} from "../../types/music";
import useUserStore from "../../store/userStore";
import React, {useEffect, useRef, useState} from "react";
import Skeleton from "@/components/common/Skeleton";

interface MusicListProps {
    initialMusic: Music[];
    isLastPage: boolean;
}

function MusicList({ initialMusic, isLastPage: initialIsLastPage }: MusicListProps) {

    const user = useUserStore((state) => state.user);
    const setLoading = useUserStore((state) => state.setLoading);
    const loading = useUserStore((state) => state.loading);

    const [musicList, setMusicList] = useState<Music[]>(initialMusic);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(initialIsLastPage);
    const itemsPerPage = 5;

    const [isOpen, setIsOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const modalRef = useRef<HTMLDivElement | null>(null);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const toggleComment = (musicId: string) => {
        setExpandedId(prev => (prev === musicId ? null : musicId));
    };

    const openModal = (event: React.MouseEvent, musicId: string) => {
        setIsOpen(true);
        setSelectedMusicId(musicId);
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setModalPosition({
            x: rect.left - 150,
            y: rect.bottom + 5,
        });
    };

    const closeModal = () => setIsOpen(false);

    const handleDelete = async () => {
        if (!selectedMusicId) return;

        try {
            const response = await fetch(`/api/music/${selectedMusicId}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Failed to delete music");

            alert("Music successfully deleted");

            setMusicList([]);
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

    const fetchMusicList = async (page: number) => {
        try {
            const response = await fetch(`/api/music?page=${page}&size=${itemsPerPage}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch music: ${ response.status } ${ response.statusText }`);
            }
            const data = await response.json();
            setMusicList(prevList => [...prevList, ...data.content]);
            setIsLastPage(data.last);
        } catch (error) {
            console.error("Error fetching music:", error);
            setError("Failed to fetch music from API");
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

        if (currentPage > 0 || (currentPage === 0 && initialMusic.length === 0)) {
            fetchMusicList(currentPage);
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
                <Link href="/music/add">
                    <button className="mb-5 bg-blue-400 text-white font-bold px-4 py-2 rounded">
                        ADD
                    </button>
                </Link>
            )}
            {loading ? (
                <Skeleton/>
            ) : (
                <>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="flex justify-between items-center pb-4">
                        <div className="flex justify-center text-sm">
                            <img className="w-5 h-5 pr-1" src="/images/masterpiece.png" alt="masterpiece"/>
                            : Crazy album
                        </div>
                    </div>
                    <ul className="space-y-4">
                        {musicList.map((music, index) => (
                            <li key={index} className="border border-gray-300 rounded-lg shadow-sm">
                                <div
                                    className="flex justify-items-start items-center p-4 cursor-pointer"
                                    onClick={() => toggleComment(music.id)}
                                >
                                    <div className="pr-6">
                                        {music.thumbnail ? (
                                            <img src={music.thumbnail} alt={music.title} className="w-20 h-20 object-cover rounded-lg"/>
                                        ) : (
                                            <img src="/images/albumart.png" className="w-20 h-20 object-cover rounded-lg"/>
                                        )}

                                    </div>
                                    <div>
                                        <p className="font-bold">{music.title}</p>
                                        <p className="text-gray-600">{music.artist}</p>
                                    </div>
                                    <div className="ml-auto flex items-start flex-col">
                                        {!user && music.isMasterPiece && (
                                            <img
                                                src="/images/masterpiece.png"
                                                alt="Masterpiece"
                                                className="w-6 h-6"
                                                style={{
                                                    width: "50px",
                                                    height: "40px",
                                                    marginRight: "-10px",
                                                    marginTop: "-50px",
                                                }}
                                            />
                                        )}
                                        {!loading && user && (
                                            <button
                                                className="text-gray-500 hover:text-gray-800 font-bold text-xl"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    openModal(event, music.id);
                                                }}
                                            >
                                                ⋮
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* comment */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                        expandedId === music.id ? "max-h-40 p-4" : "max-h-0 p-0"
                                    } text-gray-700 text-sm`}
                                >
                                    {expandedId === music.id && (
                                        <p className="text-gray-500">{music.commentId || "No comments available."}</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div ref={loaderRef} className="flex justify-center my-4">
                        {loading && <p>Loading more music...</p>}
                    </div>
                </>
            )}

            {isOpen && (
                <div
                    ref={modalRef}
                    className="absolute shadow-lg border border-gray-200 rounded-lg p-2 w-40"
                    style={{backgroundColor: 'var(--background)', top: modalPosition.y, left: modalPosition.x}}
                >
                    <Link href={`/music/update/${selectedMusicId}`} className="block w-full text-left p-2">
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

export default MusicList;