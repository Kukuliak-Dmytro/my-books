import { NextRequest, NextResponse } from 'next/server';
import { searchAuthors } from '../../lib/author';
import { formatAPIRESPONSE } from '@/lib/api';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

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

        const authors = await searchAuthors(query.trim());

        return formatAPIRESPONSE({
            data: authors,
            error: null,
            message: `Found ${authors.length} authors`,
            status: 200,
        });

    } catch (error: unknown) {
        console.error('Error searching authors:', error);
        return formatAPIRESPONSE({
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error',
            message: 'Error searching authors',
            status: 500,
        });
    }
}