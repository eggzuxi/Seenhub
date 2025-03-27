"use client"

import Link from "next/link";
import {Music} from "../../types/music";
import Spinner from "@/components/common/Spinner";
import AlbumArt from "@/components/AlbumArt";
import Pagination from "@/components/common/Pagination";
import useUserStore from "../../store/userStore";
import {useEffect, useRef, useState} from "react";

interface MusicListProps {
    initialMusic: Music[];
}

function MusicList({ initialMusic }: MusicListProps) {

    const user = useUserStore((state) => state.user);
    const setLoading = useUserStore((state) => state.setLoading);
    const loading = useUserStore((state) => state.loading);
    const [musicList, setMusicList] = useState<Music[]>(initialMusic);
    const [error, setError] = useState("");

    const [ currentPage, setCurrentPage ] = useState(1);
    const itemsPerPage = 5;

    const [isOpen, setIsOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null);

    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setLoading(false);
    }, []);

    const totalPages = Math.ceil(musicList.length / itemsPerPage);
    const displayedMusic = musicList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const openModal = (event: React.MouseEvent, musicId: string) => {
        setIsOpen(true);
        setSelectedMusicId(musicId);
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setModalPosition({
            x: rect.left - 150, // 버튼 왼쪽으로 약간 이동
            y: rect.bottom + 5, // 버튼 아래에 여백 추가
        });
    };

    const closeModal = () => setIsOpen(false);

    const handleDelete = async () => {
        if (!selectedMusicId) return;

        try {
            const response = await fetch(`/api/music`, {
                method: "PUT", // PUT 요청을 사용
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: selectedMusicId }),
            });

            if (!response.ok) throw new Error("Failed to delete music");

            alert("Music successfully deleted");
            // 삭제된 음악을 목록에서 제거
            setMusicList((prevMusic) => prevMusic.filter((music) => music._id !== selectedMusicId));
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
                <Link href="/music/add">
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
                        {displayedMusic.map((music, index) => (
                            <li key={index}
                                className="flex justify-items-start items-center p-4 border border-gray-300 rounded-lg shadow-sm">
                                <div className="pr-6">
                                    <AlbumArt mbid={music.mbid}/>
                                </div>
                                <div>
                                    <p className="font-bold">{music.title}</p>
                                    <p className="text-gray-600">{music.artist}</p>
                                </div>
                                <div className="ml-auto">
                                    {!loading && user && (
                                        <button
                                            className="text-gray-500 hover:text-gray-200 font-bold text-xl"
                                            onClick={(event) => openModal(event, music._id)}
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

export default MusicList;