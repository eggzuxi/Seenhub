import BookList from "@/components/BookList";

async function fetchBook() {

    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${baseUrl}/api/book`);
        if (!response.ok) {
            throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching books:", error);
        throw new Error("Failed to fetch books from API");
    }
}

export default async function Page() {

    const bookList = await fetchBook();

    return <BookList initialBooks={bookList} />

}
