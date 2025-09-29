import { getAllBooks } from "../lib/books";

import { NextResponse } from "next/server";
import { formatAPIRESPONSE } from "@/lib/api";
export async function GET() {
    try {
        const books = await getAllBooks();
        return formatAPIRESPONSE({
            data: books,
            error: null,
            message: 'Books fetched successfully',
            status: 200,
        });
    } catch (error: unknown) {
        console.error("Error fetching books:", error);
        return formatAPIRESPONSE({
              data: null,
            error: "Failed to fetch books",
            message: error instanceof Error ? error.message : 'Unknown error',
            status: 500,
        });
    }
}