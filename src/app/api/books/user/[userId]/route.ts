import { NextRequest, NextResponse } from 'next/server';
import { getUserBooks } from '@/app/api/lib/books';
import { verifyAuthHeader } from '@/app/api/lib/jwt';
import { formatAPIRESPONSE } from '@/lib/api';
import connectionPool from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        // Verify authentication using helper
        const authHeader = request.headers.get('authorization');
        const authResult = await verifyAuthHeader(authHeader);
        
        if (!authResult.success) {
            return formatAPIRESPONSE({
                data: null,
                error: authResult.error,
                message: authResult.message,
                status: authResult.status,
            });
        }

        const { userId } = params;

        // Validate userId parameter
        if (!userId) {
            return formatAPIRESPONSE({
                data: null,
                error: 'Validation Error',
                message: 'User ID is required',
                status: 400,
            });
        }

        const userData = authResult.payload;

        // Check if user is requesting their own books or has admin privileges
        if (userData.userId !== userId && userData.role !== 'admin') {
            return formatAPIRESPONSE({
                data: null,
                error: 'Forbidden',
                message: 'You can only access your own book list',
                status: 403,
            });
        }

        // Fetch user's books
        const userBooks = await getUserBooks(userId);

        return formatAPIRESPONSE({
            data: userBooks,
            error: null,
            message: 'User books fetched successfully',
            status: 200,
        });

    } catch (error) {
        console.error('Error fetching user books:', error);
        return formatAPIRESPONSE({
            data: null,
            error: 'Failed to fetch user books',
            message: error instanceof Error ? error.message : 'Unknown error',
            status: 500,
        });
    }
}

// Add or update a book in user's library
export async function POST(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        // Verify authentication using helper
        const authHeader = request.headers.get('authorization');
        const authResult = await verifyAuthHeader(authHeader);
        
        if (!authResult.success) {
            return formatAPIRESPONSE({
                data: null,
                error: authResult.error,
                message: authResult.message,
                status: authResult.status,
            });
        }

        const userData = authResult.payload;
        
        if (!userData) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        const { userId } = params;
        const body = await request.json();
        const { bookId, rating, status, description, startedAt, finishedAt } = body;

        // Validate userId parameter and authorization
        if (!userId || userData.userId !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        if (!bookId) {
            return NextResponse.json(
                { error: 'Book ID is required' },
                { status: 400 }
            );
        }

        // Check if the book entry already exists
        const existingEntry = await connectionPool.query(
            'SELECT id FROM user_books WHERE user_id = $1 AND book_id = $2',
            [userId, bookId]
        );

        let result;
        
        if (existingEntry.rows.length > 0) {
            // Update existing entry
            result = await connectionPool.query(
                `UPDATE user_books 
                 SET rating = $1, status = $2, description = $3, started_at = $4, finished_at = $5, updated_at = NOW()
                 WHERE user_id = $6 AND book_id = $7
                 RETURNING *`,
                [rating, status, description, startedAt, finishedAt, userId, bookId]
            );
        } else {
            // Create new entry
            result = await connectionPool.query(
                `INSERT INTO user_books (user_id, book_id, rating, status, description, started_at, finished_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING *`,
                [userId, bookId, rating, status, description, startedAt, finishedAt]
            );
        }

        return NextResponse.json({
            success: true,
            data: result.rows[0],
            message: existingEntry.rows.length > 0 ? 'Book updated successfully' : 'Book added to library successfully'
        });

    } catch (error) {
        console.error('Error updating user book:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Remove a book from user's library
export async function DELETE(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        // Verify authentication using helper
        const authHeader = request.headers.get('authorization');
        const authResult = await verifyAuthHeader(authHeader);
        
        if (!authResult.success) {
            return formatAPIRESPONSE({
                data: null,
                error: authResult.error,
                message: authResult.message,
                status: authResult.status,
            });
        }

        const userData = authResult.payload;
        
        if (!userData) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        const { userId } = params;
        const { bookId } = await request.json();

        // Validate userId parameter and authorization
        if (!userId || userData.userId !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        if (!bookId) {
            return NextResponse.json(
                { error: 'Book ID is required' },
                { status: 400 }
            );
        }

        // Delete the user book entry
        const result = await connectionPool.query(
            'DELETE FROM user_books WHERE user_id = $1 AND book_id = $2 RETURNING *',
            [userId, bookId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Book not found in your library' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Book removed from library successfully'
        });

    } catch (error) {
        console.error('Error removing user book:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}