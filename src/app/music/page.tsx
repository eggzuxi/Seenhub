import MusicList from "@/components/MusicList";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

async function fetchMusic() {

    try {

        const response = await fetch(`${BASE_URL}/api/music?page=0&size=5`);
        if (!response.ok) {
            throw new Error(`Failed to fetch music: ${ response.status } ${ response.statusText }`);
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.error("Error fetching music:", error);
        throw new Error("Failed to fetch music from API");
    }

}

export default async function Page() {

    const data = await fetchMusic();

    return <MusicList initialMusic={data.content} isLastPage={data.last} />

}