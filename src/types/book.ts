export default interface Book{
    id: string;
    title: string;
    pages: number;
    rating: number;
    authorId: string;
    categoryId: string;
    coverUrl: string;
    publishDate: string;
    createdAt: string;
    updatedAt: string;
    annptation?: string; // Note: matches the database column name
    // Joined fields from related tables
    authorName?: string; // from authors.full_name
    categoryName?: string; // from categories.title
}