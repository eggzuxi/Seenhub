import SeriesList from "@/components/SeriesList";

async function fetchSeries() {

    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${baseUrl}/api/series`);
        if (!response.ok) {
            throw new Error(`Failed to fetch series: ${response.status} ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching series:", error);
        throw new Error("Failed to fetch series from API");
    }

}

export default async function Page() {

    const seriesList = await fetchSeries();

    return <SeriesList initialSeries={seriesList} />

}
