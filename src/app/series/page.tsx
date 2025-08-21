import SeriesList from "@/components/SeriesList";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const dynamic = "force-dynamic";

async function fetchSeries() {

    try {

        const response = await fetch(`${BASE_URL}/api/series?page=0&size=5`);
        if (!response.ok) {
            throw new Error(`Failed to fetch series: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching series:", error);
        throw new Error("Failed to fetch series from API");
    }

}

export default async function Page() {

    const data = await fetchSeries();

    return <SeriesList initialSeries={data.content} isLastPage={data.last} />

}
