import connectionPool from "@/lib/db";
import type { Author } from "@/types/author";
export async function createAuthor(author: Partial<Author>): Promise<Author> {
    const { full_name, dob, description } = author;
  
    if (!full_name || !dob || !description) {
        throw new Error("Missing required fields: full_name, dob, description");
    }
    try{
        const newAuthor= await connectionPool.query(
            'INSERT INTO authors (full_name, dob, description) VALUES ($1, $2, $3) RETURNING *',
            [full_name, dob, description]
        );
        return newAuthor.rows[0];
    }
    catch(error:unknown){
        console.error('Error creating author:', error);
        throw new Error('Database error while creating author');
    }
}
export async function getAllAuthors(): Promise<Author[]> {
    try{
        const result= await connectionPool.query('SELECT * FROM authors ORDER BY created_at DESC');
        return result.rows;
    }
    catch(error:unknown){
        console.error('Error fetching authors:', error);
        throw new Error('Database error while fetching authors');
    }
}

export async function searchAuthors(query: string): Promise<Author[]> {
    try {
        const result = await connectionPool.query(
            'SELECT * FROM authors WHERE LOWER(full_name) LIKE LOWER($1) ORDER BY full_name ASC LIMIT 20',
            [`%${query}%`]
        );
        return result.rows;
    } catch (error: unknown) {
        console.error('Error searching authors:', error);
        throw new Error('Database error while searching authors');
    }
}