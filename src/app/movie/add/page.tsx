import AddForm from "@/components/common/AddForm";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import jwt from "jsonwebtoken";

export default async function AddMoviePage() {

    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { name: string };
        console.log("로그인한 유저: ", decoded.name);
    } catch (err: unknown) {
        if (err instanceof Error) {
            redirect("/login");
        }
    }

    return (
        <AddForm type="movie" />
    );
}