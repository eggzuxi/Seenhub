"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Book } from "../../../types/book";
import Pagination from "@/components/common/Pagination";
import useAuth from "../../../hooks/useAuth";

function Page() {
    const { user, loading: authLoading } = useAuth();
    const [bookList, setBookList] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [ currentPage, setCurrentPage ] = useState(1);
    const itemsPerPage = 5;

    const [isOpen, setIsOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch("/api/book");
                if (!response.ok) throw new Error("Failed to fetch book data");
                const data = await response.json();
                setBookList(data);
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
        fetchBook();
    }, []);

    const totalPages = Math.ceil(bookList.length / itemsPerPage);
    const displayedBook = bookList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const openModal = (event: React.MouseEvent, bookId: string) => {
        setIsOpen(true);
        setSelectedBookId(bookId);
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setModalPosition({
            x: rect.left - 150, // 버튼 왼쪽으로 약간 이동
            y: rect.bottom + 5, // 버튼 아래에 여백 추가
        });
    };

    const closeModal = () => setIsOpen(false);

    const handleDelete = async () => {
        if (!selectedBookId) return;

        try {
            const response = await fetch(`/api/book`, {
                method: "PUT", // PUT 요청을 사용
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: selectedBookId }),
            });

            if (!response.ok) throw new Error("Failed to delete book");

            alert("Book successfully deleted");
            // 삭제된 책을 목록에서 제거
            setBookList((prevBooks) => prevBooks.filter((book) => book._id !== selectedBookId));
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
            {!authLoading && user && (
                <Link href="/book/add">
                    <button className="mb-5 bg-gray-500 text-white font-bold px-4 py-2 rounded">
                        ADD
                    </button>
                </Link>
            )}
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <>
                    <ul className="space-y-4">
                        {displayedBook.map((book, index) => (
                            <li key={index}
                                className="flex justify-between items-center p-4 border border-gray-300 rounded-lg shadow-sm">
                                <div>
                                    <p className="font-bold">{book.title}</p>
                                    <p className="text-gray-600">{book.author}</p>
                                </div>
                                {!authLoading && user && (
                                    <button
                                        className="text-gray-500 hover:text-gray-200 font-bold text-xl"
                                        onClick={(event) => openModal(event, book._id)}
                                    >
                                        ⋮
                                    </button>
                                )}
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

export default Page;
