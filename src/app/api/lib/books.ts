import connectionPool from "@/lib/db";
import type Book from "@/types/book";

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
