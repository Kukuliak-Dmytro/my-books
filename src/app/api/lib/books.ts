import connectionPool from "@/lib/db";
import type Book from "@/types/book";
import type { UserBookWithDetails } from "@/types/userBook";

export async function getAllBooks(): Promise<Book[]> {
    const result = await connectionPool.query(`
        SELECT 
            b.id,
            b.title,
            b.pages,
            b.rating,
            b.author_id as "authorId",
            b.category_id as "categoryId",
            b.cover_url as "coverUrl",
            b.publish_date as "publishDate",
            b.created_at as "createdAt",
            b.updated_at as "updatedAt",
            b.annptation,
            a.full_name as "authorName",
            c.title as "categoryName"
        FROM books b
        LEFT JOIN authors a ON b.author_id = a.id
        LEFT JOIN categories c ON b.category_id = c.id
        ORDER BY b.created_at DESC
    `);
    return result.rows;
}

export async function getUserBooks(userId: string): Promise<UserBookWithDetails[]> {
    const result = await connectionPool.query(`
        SELECT 
            ub.id,
            ub.user_id as "userId",
            ub.book_id as "bookId",
            ub.rating,
            ub.status,
            ub.description,
            ub.started_at as "startedAt",
            ub.finished_at as "finishedAt",
            ub.created_at as "createdAt",
            ub.updated_at as "updatedAt",
            -- Book details
            b.title,
            b.pages,
            b.rating as "bookRating",
            b.author_id as "authorId",
            b.category_id as "categoryId",
            b.cover_url as "coverUrl",
            b.publish_date as "publishDate",
            b.annptation,
            -- Joined data
            a.full_name as "authorName",
            c.title as "categoryName"
        FROM user_books ub
        INNER JOIN books b ON ub.book_id = b.id
        LEFT JOIN authors a ON b.author_id = a.id
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE ub.user_id = $1
        ORDER BY ub.updated_at DESC, ub.created_at DESC
    `, [userId]);
    return result.rows;
}

export async function searchBooks(query: string, authorId?: string): Promise<Book[]> {
    let searchQuery = `
        SELECT 
            b.id,
            b.title,
            b.pages,
            b.rating,
            b.author_id as "authorId",
            b.category_id as "categoryId",
            b.cover_url as "coverUrl",
            b.publish_date as "publishDate",
            b.created_at as "createdAt",
            b.updated_at as "updatedAt",
            b.annptation,
            a.full_name as "authorName",
            c.title as "categoryName"
        FROM books b
        LEFT JOIN authors a ON b.author_id = a.id
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE LOWER(b.title) LIKE LOWER($1)
    `;
    
    const params: any[] = [`%${query}%`];
    
    if (authorId) {
        searchQuery += ` AND b.author_id = $2`;
        params.push(authorId);
    }
    
    searchQuery += ` ORDER BY b.title ASC LIMIT 20`;
    
    const result = await connectionPool.query(searchQuery, params);
    return result.rows;
}

export async function createBook(bookData: {
    title: string;
    description?: string;
    year_published?: number;
    pages?: number;
    category_id?: string;
    author_id: string;
}): Promise<Book> {
    console.log('📚 Creating book in database with data:', bookData);
    
    const result = await connectionPool.query(`
        INSERT INTO books (
            title, 
            annptation, 
            pages, 
            author_id, 
            category_id,
            publish_date,
            created_at, 
            updated_at
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING 
            id,
            title,
            pages,
            rating,
            author_id as "authorId",
            category_id as "categoryId",
            cover_url as "coverUrl",
            publish_date as "publishDate",
            created_at as "createdAt",
            updated_at as "updatedAt",
            annptation
    `, [
        bookData.title,
        bookData.description || null,
        bookData.pages || null,
        bookData.author_id,
        bookData.category_id || null,
        bookData.year_published ? `${bookData.year_published}-01-01` : null
    ]);
    
    console.log('✅ Book created in database:', result.rows[0]);
    return result.rows[0];
}
