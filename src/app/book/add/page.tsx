import AddForm from "@/components/common/AddForm";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AddBookPage() {

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

    return <AddForm type="book" />;
}
