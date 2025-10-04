// UserBook represents a book in a user's personal library
export interface UserBook {
    id: string;
    userId: string;
    bookId: string;
    rating?: number; // User's personal rating for this book
    status?: 'wishlist' | 'reading' | 'completed' | 'paused' | 'dropped';
    description?: string; // User's personal notes about the book
    startedAt?: string; // When the user started reading
    finishedAt?: string; // When the user finished reading
    createdAt: string; // When added to user's list
    updatedAt: string; // Last update to user's book entry
}

// UserBookData represents the user-specific fields when adding a book to library
export interface UserBookData {
    rating?: number;
    status?: 'wishlist' | 'reading' | 'completed' | 'paused' | 'dropped';
    description?: string;
    startedAt?: string;
    finishedAt?: string;
}

// UserBookWithDetails extends UserBook with full book information
export interface UserBookWithDetails extends UserBook {
    // Book details
    title: string;
    pages: number;
    bookRating: number; // Global book rating (to distinguish from user's rating)
    authorId: string;
    categoryId: string;
    coverUrl: string;
    publishDate: string;
    annptation?: string;
    
    // Joined data
    authorName: string;
    categoryName: string;
}

export default UserBook;