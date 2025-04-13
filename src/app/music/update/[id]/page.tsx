"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {Music} from "../../../../../types/music";
import Spinner from "@/components/common/Spinner";
import EditForm from "@/components/common/EditForm";

interface MusicDetailPageParams {
    id: string;
    [key: string]: string | string[] | undefined;
}

const Page = () => {
    const { id } = useParams<MusicDetailPageParams>();
    const [initialData, setInitialData] = useState<Music | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMusic = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/music/${id}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Failed to fetch music.");
                }
                const data = await res.json();
                setInitialData(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unexpected error occurred.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMusic();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Spinner size={50} color="#3498db" />
            </div>
        );
    }

    if (error) {
        return <div className="p-6 text-red-500">Error: {error}</div>;
    }

    if (!initialData) {
        return <div className="p-6">Music not found.</div>;
    }

    return (
        <div className="container p-10">
            <h1 className="text-2xl font-bold mb-4">Edit Music</h1>
            <EditForm type="music" initialData={initialData} />
        </div>
    );
};

export default Page;