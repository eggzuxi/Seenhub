"use client"

import Link from "next/link";
import Avatar from "boring-avatars";
import {useEffect, useRef, useState} from "react";
import useUserStore from "../../store/userStore";
import ThemeButton from "@/components/common/ThemeButton";
import {ThemeProvider} from "next-themes";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.clearUser);
    const [activeLink, setActiveLink] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleClick = (link: string) => {
        setActiveLink(link);
    };

    const handleAvatarClick = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    useEffect(() => {
        if (showModal) {
            const handleClickOutside = (event: MouseEvent) => {
                if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                    setShowModal(false);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);

            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [showModal]);

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/user", { method: "DELETE" });
            if (!res.ok) {
                throw new Error("Logout failed");
            }
            setUser();
            setShowModal(false);
        } catch (error) {
            console.error("Logout error:", error);
            alert("Logout failed. Please try again.");
        }
    };

    return (
        <ThemeProvider attribute="class">
            <header>
                <div className="container flex justify-between p-10">
                    <Link href="/" className="text-center text-3xl font-bold">SEENHUB</Link>
                    <div className="flex items-center space-x-4">
                        <div onClick={handleAvatarClick} style={{cursor: 'pointer'}}>
                            <Avatar name="Julia" colors={["#ff0000", "#0000ff"]} variant="beam" size={40}/>
                        </div>
                        <ThemeButton />
                    </div>
                </div>
                <div className="container pl-10">
                    <ol>
                        <li className="flex space-x-6 font-bold">
                            <Link href="/music" onClick={() => handleClick('/music')}
                                  style={{textShadow: activeLink === '/music' ? '4px 4px 2px gray' : 'none'}}>MUSIC</Link>
                            <Link href="/movie" onClick={() => handleClick('/movie')}
                                  style={{textShadow: activeLink === '/movie' ? '4px 4px 2px gray' : 'none'}}>MOVIE</Link>
                            <Link href="/book" onClick={() => handleClick('/book')}
                                  style={{textShadow: activeLink === '/book' ? '4px 4px 2px gray' : 'none'}}>BOOK</Link>
                            <Link href="/series" onClick={() => handleClick('/series')}
                                  style={{textShadow: activeLink === '/series' ? '4px 4px 2px gray' : 'none'}}>SERIES</Link>
                        </li>
                    </ol>
                </div>
            </header>

            <main>{children}</main>

            <footer className="flex items-start container p-10 text-sm text-gray-600">
                <div className="mr-10 pr-10 border-r border-gray-600"> {/* 세로 바 추가 */}
                    <p>seenhub v.1.0</p>
                    <p>
                        Developed by{" "}
                        <a
                            href="https://github.com/eggzuxi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            EGGZUXI
                        </a>
                    </p>
                </div>
                <div>
                    <p>
                        Album data & images provided by{" "}
                        <a
                            href="https://www.last.fm/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            Last.fm
                        </a>
                    </p>
                    <p>
                        This product uses the TMDB API but is not endorsed or certified by TMDB.
                    </p>
                    <p>
                        Movie, Series data & images provided by{" "}
                        <a
                            href="https://www.themoviedb.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            TMDB
                        </a>
                    </p>
                    <p className="mt-4">
                        <img
                            src="/tmdb.svg"
                            alt="TMDB Logo"
                            className="inline-block h-6 mx-1"
                        />
                    </p>
                </div>
            </footer>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="p-6 rounded-md w-60 bg-ivory dark:bg-darkgray" ref={modalRef}>
                        <h2 className="text-center text-lg font-bold mb-4">Welcome!</h2>
                        <div className="flex justify-center space-x-4">
                            {user ? ( // user 상태에 따라 버튼 변경
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    {/*<Link href="/join" onClick={handleCloseModal}>*/}
                                    {/*    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">*/}
                                    {/*        Sign Up*/}
                                    {/*    </button>*/}
                                    {/*</Link>*/}
                                    <Link href="/login" onClick={handleCloseModal}>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                            Login
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </ThemeProvider>
    )

}