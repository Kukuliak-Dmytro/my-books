import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../lib/jwt";

export async function POST(req: NextRequest) {
    const { token } = await req.json();

    if (!token) {
        return NextResponse.json({ message: "Token is required" }, { status: 400 });
    }

    try {
        await verifyToken(token);
        return NextResponse.json({ message: "Token is valid" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
}
