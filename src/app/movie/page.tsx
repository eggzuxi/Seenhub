import MovieList from "@/components/MovieList";

async function fetchMovie() {

    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${baseUrl}/api/movie`);
        if (!response.ok) {
            throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching movies:", error);
        throw new Error("Failed to fetch movies from API");
    }

}

export default async function Page() {

    const movieList = await fetchMovie();

    return <MovieList initialMovies={movieList} />

}