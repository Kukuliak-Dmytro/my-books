import { NextRequest, NextResponse } from 'next/server';
import { searchBooks } from '../../lib/books';
import { formatAPIRESPONSE } from '@/lib/api';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const authorId = searchParams.get('authorId');

        if (!query || query.trim().length === 0) {
            return formatAPIRESPONSE({
                data: [],
                error: null,
                message: 'Search query is required',
                status: 400,
            });
        }

        if (query.trim().length < 2) {
            return formatAPIRESPONSE({
                data: [],
                error: null,
                message: 'Search query must be at least 2 characters',
                status: 400,
            });
        }

        const books = await searchBooks(query.trim(), authorId || undefined);

        return formatAPIRESPONSE({
            data: books,
            error: null,
            message: `Found ${books.length} books`,
            status: 200,
        });

    } catch (error: unknown) {
        console.error('Error searching books:', error);
        return formatAPIRESPONSE({
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error',
            message: 'Error searching books',
            status: 500,
        });
    }
}