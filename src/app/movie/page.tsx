import MovieList from "@/components/MovieList";

async function fetchMovie() {

    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/movie?page=0&size=5`);
        if (!response.ok) {
            throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.error("Error fetching movies:", error);
        throw new Error("Failed to fetch movies from API");
    }

}

export default async function Page() {

    const data = await fetchMovie();

    return <MovieList initialMovies={data.content} isLastPage={data.last} />

}