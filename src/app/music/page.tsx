import MusicList from "@/components/MusicList";

async function fetchMusic() {

    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${baseUrl}/api/music`);
        if (!response.ok) {
            throw new Error(`Failed to fetch music: ${response.status} ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching music:", error);
        throw new Error("Failed to fetch music from API");
    }

}

export default async function Page() {

    const musicList = await fetchMusic();

    return <MusicList initialMusic={musicList} />

}