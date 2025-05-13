"use client";

import Link from "next/link";
import {Book} from "../../types/book";
import React, { useState, useEffect, useRef } from "react";
import Pagination from "@/components/common/Pagination";
import Spinner from "@/components/common/Spinner";
import useUserStore from "../../store/userStore";

interface BookListProps {
    initialBooks: Book[];
}

function BookList({ initialBooks }: BookListProps) {

    const user = useUserStore((state) => state.user);
    const setLoading = useUserStore((state) => state.setLoading);
    const loading = useUserStore((state) => state.loading);
    const [bookList, setBookList] = useState<Book[]>(initialBooks);
    const [error, setError] = useState("");

    const [ currentPage, setCurrentPage ] = useState(1);
    const itemsPerPage = 5;

    const [isOpen, setIsOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const modalRef = useRef<HTMLDivElement | null>(null);
    const toggleComment = (bookId: string) => {
        setExpandedId(prev => (prev === bookId ? null : bookId));
    };

    useEffect(() => {
        setLoading(false);
        fetchBookList();
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
            await fetchBookList();
            closeModal();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    const fetchBookList = async () => {
        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${baseUrl}/api/book`);
            if (!response.ok) {
                throw new Error(`Failed to fetch book: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setBookList(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching book:", error);
            setError("Failed to fetch book from API");
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
                <Link href="/book/add">
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
                    <div className="text-sm pb-4">Reading is hard. Updates are harder 😴</div>
                    <ul className="space-y-4">
                        {displayedBook.map((book, index) => (
                            <li
                                key={index}
                                className="flex flex-col justify-between h-full p-4 border border-gray-300 rounded-lg shadow-sm"
                                onClick={() => toggleComment(book._id)}
                            >
                                <div className="flex items-start justify-between space-x-4">
                                    {book.thumbnail && (
                                        <img
                                            src={book.thumbnail}
                                            alt={`${book.title} image`}
                                            className="w-14 h-auto rounded"
                                        />
                                    )}
                                    <div className="flex-grow">
                                        <p className="font-bold">{book.title}</p>
                                        <p className="text-gray-600">{book.author}</p>
                                    </div>
                                    {!loading && user && (
                                        <button
                                            className="ml-auto text-gray-500 hover:text-gray-800 font-bold text-xl"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                openModal(event, book._id);
                                            }}
                                        >
                                            ⋮
                                        </button>
                                    )}
                                </div>
                                {/* comment: 항상 하단에 위치 */}
                                <div
                                    className={`mt-auto overflow-hidden transition-all duration-300 ease-in-out ${
                                        expandedId === book._id ? "max-h-40 pt-4" : "max-h-0 p-0"
                                    } text-gray-700 text-sm`}
                                >
                                    {expandedId === book._id && (
                                        <p className="text-gray-500">
                                            {book.comment || "No comments available."}
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
                    <Link href={`/book/update/${selectedBookId}`} className="block w-full text-left p-2">
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

export default BookList;