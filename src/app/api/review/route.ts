import {connectDB} from "../../../../lib/mongodb";
import {Review} from "../../../../models/Review";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try {
        const { _id, comment } = await req.json();
        await connectDB();

        const newReview = new Review({ _id, comment });
        await newReview.save();

        return NextResponse.json(newReview);
    } catch (error) {
        return NextResponse.json({ error: "데이터 추가 실패" }, { status: 500 });
    }
}
