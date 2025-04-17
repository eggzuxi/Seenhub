"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs"; // 예시 아이콘 라이브러리

export default function ThemeButton() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // 컴포넌트가 마운트된 후에 useTheme 사용
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // 또는 로딩 상태 표시
    }

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-300"
        >
            {theme === "light" ? <BsMoonStarsFill className="w-6 h-6 text-gray-800 dark:text-gray-200 mx-auto" /> : <BsSunFill className="w-6 h-6 text-yellow-500 dark:text-yellow-400 mx-auto" />}
        </button>
    );
}