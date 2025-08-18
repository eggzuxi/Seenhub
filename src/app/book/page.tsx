import BookList from "@/components/BookList";

const BASE_URL = process.env.NEXT_PUBLIC_LOCAL_URL

async function fetchBook() {

    try {

        const response = await fetch(`${BASE_URL}/api/book?page=0&size=5`);
        if (!response.ok) {
            throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.error("Error fetching books:", error);
        throw new Error("Failed to fetch books from API");
    }
}

export default async function Page() {

    const data = await fetchBook();

    return <BookList initialBooks={data.content} isLastPage={data.last} />

}
