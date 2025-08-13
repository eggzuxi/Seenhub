"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/common/Spinner";
import useUserStore from "../../../store/userStore";

export default function LoginPage() {
    const setUser = useUserStore((state) => state.setUser);
    const setLoading = useUserStore((state) => state.setLoading);
    const loading = useUserStore((state) => state.loading);
    const [formData, setFormData] = useState({
        userId: "",
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
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            setUser(data);
            alert(`Welcome, ${data.name}!`);
            router.push("/");

        } catch (error) {
            setError(error instanceof Error ? error.message : "Something went wrong");
        }
    };

    return (
        <div className="flex h-screen">
                <form className="w-full max-w-md p-10 rounded-lg" onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-4">Login</h2>
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    <input
                        type="text"
                        name="userId"
                        placeholder="ID"
                        value={formData.userId}
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
                    <button
                        type="submit"
                        className="w-full p-2 flex items-center justify-center bg-gray-500 text-white rounded hover:bg-gray-600"
                        disabled={loading}
                    >
                        {loading ? <Spinner size={20} color="#3498db"/> : "Login"}
                    </button>
                </form>
        </div>
    );
}