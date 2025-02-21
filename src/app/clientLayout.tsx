"use client"

import Link from "next/link";
import Avatar from "boring-avatars";
import {useEffect, useRef, useState} from "react";
import useAuth from "../../hooks/useAuth";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleAvatarClick = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowModal(false);
            }
        };

        if (showModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showModal]);

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/user", { method: "DELETE" });
            if (!res.ok) {
                throw new Error("Logout failed");
            }
            window.location.reload(); // 로그아웃 후 페이지 새로고침
        } catch (error) {
            console.error("Logout error:", error);
            alert("Logout failed. Please try again.");
        }
    };

    return (
        <>
            <header>
                <div className="container flex justify-between p-10">
                    <Link href="/" className="text-center text-3xl font-bold">SEENHUB</Link>
                    <div onClick={handleAvatarClick} style={{cursor: 'pointer'}}>
                        <Avatar name="Julia" colors={["#ff0000", "#0000ff"]} variant="beam" size={40}/>
                    </div>

                </div>
                <div className="container pl-10">
                    <ol>
                        <li className="flex space-x-6 font-bold">
                            <Link href="/music">MUSIC</Link>
                            <Link href="/movie">MOVIE</Link>
                            <Link href="/book">BOOK</Link>
                        </li>
                    </ol>
                </div>
            </header>

            <main>{children}</main>

            <footer className="container p-10">seenhub v.0.1</footer>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-gray-500 p-6 rounded-md" ref={modalRef}>
                        <h2 className="text-lg font-bold mb-4">Welcome!</h2>
                        <div className="flex justify-center space-x-4">
                            {user ? ( // user 상태에 따라 버튼 변경
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link href="/join" onClick={handleCloseModal}>
                                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                            Sign Up
                                        </button>
                                    </Link>
                                    <Link href="/login" onClick={handleCloseModal}>
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                            Login
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )

}