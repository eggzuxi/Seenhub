"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Series } from "../../../../../types/series";
import Spinner from "@/components/common/Spinner";
import EditForm from "@/components/common/EditForm";

interface SeriesDetailPageParams {
    id: string;
    [key: string]: string | string[] | undefined;
}

const Page = () => {
    const { id } = useParams<SeriesDetailPageParams>();
    const [initialData, setInitialData] = useState<Series | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSeries = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/series/${id}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Failed to fetch series.");
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
            fetchSeries();
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
        return <div className="p-6">Series not found.</div>;
    }

    return (
        <div className="container p-10">
            <h1 className="text-2xl font-bold mb-4">Edit Series</h1>
            <EditForm type="series" initialData={initialData} />
        </div>
    );
};

export default Page;