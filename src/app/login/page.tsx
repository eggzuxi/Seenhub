"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/common/Spinner";
import useUserStore from "../../../store/userStore";
import {User} from "../../../types/user";

export default function LoginPage() {
    const setUser = useUserStore((state) => state.setUser);
    const setLoading = useUserStore((state) => state.setLoading);
    const loading = useUserStore((state) => state.loading);
    const [formData, setFormData] = useState({
        id: "",
        password: "",
    });

    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, login: true }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            setUser(data.user as User);
            alert(`Welcome, ${data.user.name}!`);
            router.push("/");

        } catch (error) {
            setError(error instanceof Error ? error.message : "Something went wrong");
        }
    };

    return (
        <div className="flex h-screen">
            {loading ? (
                <div className="flex justify-center items-center w-full h-40">
                    <Spinner size={50} color="#3498db"/>
                </div>
            ) : (
                <form className="w-full max-w-md p-10 shadow-md rounded-lg" onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-4">Login</h2>
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    <input
                        type="text"
                        name="id"
                        placeholder="ID"
                        value={formData.id}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mb-2"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mb-4"
                        required
                    />
                    <button type="submit" className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                        Login
                    </button>
                </form>
            )}
        </div>
    );
}