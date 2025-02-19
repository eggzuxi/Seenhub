"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
    const [formData, setFormData] = useState({
        id: "",
        password: "",
        name: "",
    });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Sign up failed");
            }

            alert("Sign up successful");
            router.push("/");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Something went wrong");
        }
    };

    return (
        <div className="flex h-screen">
            <form className="w-full p-10 shadow-md rounded-lg" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-4">Join</h2>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <input
                    type="text"
                    name="id"
                    placeholder="ID"
                    value={formData.id}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2 font-black"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2"
                    required
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-4"
                    required
                />
                <button type="submit" className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                    Sign Up
                </button>
            </form>
        </div>
    );
}
