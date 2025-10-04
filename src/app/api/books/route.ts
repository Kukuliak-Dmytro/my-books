import { getAllBooks, createBook } from "../lib/books";
import { verifyAuthHeader } from "../lib/jwt";

import { NextResponse, NextRequest } from "next/server";
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

export async function POST(request: NextRequest) {
    try {
        console.log('📚 POST /api/books - Starting book creation');
        
        // Verify JWT token using helper
        const authHeader = request.headers.get('authorization');
        const authResult = await verifyAuthHeader(authHeader);
        
        if (!authResult.success) {
            console.log('❌ Authentication failed:', authResult.message);
            return formatAPIRESPONSE({
                data: null,
                error: authResult.error,
                message: authResult.message,
                status: authResult.status,
            });
        }

        console.log('✅ Token verified for user:', authResult.payload?.userId);

        const body = await request.json();
        console.log('📝 Request body:', body);
        const { title, description, year_published, pages, category_id, author_id } = body;

        // Validate required fields
        if (!title || !author_id) {
            console.log('❌ Missing required fields - title:', !!title, 'author_id:', !!author_id);
            return formatAPIRESPONSE({
                data: null,
                error: "Validation Error",
                message: 'Title and author_id are required',
                status: 400,
            });
        }

        console.log('📖 Creating book with data:', {
            title,
            description,
            year_published,
            pages,
            category_id,
            author_id
        });

        // Create the book
        const newBook = await createBook({
            title,
            description,
            year_published,
            pages,
            category_id,
            author_id
        });

        console.log('✅ Book created successfully:', newBook);

        return formatAPIRESPONSE({
            data: newBook,
            error: null,
            message: 'Book created successfully',
            status: 201,
        });

    } catch (error: unknown) {
        console.error("❌ Error creating book:", error);
        return formatAPIRESPONSE({
            data: null,
            error: "Failed to create book",
            message: error instanceof Error ? error.message : 'Unknown error',
            status: 500,
        });
    }
}