import type Book from "@/types/book";
import type { UserBookWithDetails } from "@/types/userBook";
import apiClient from "@/lib/http";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useBooks = () => {
    return useQuery(
        {
            queryKey: ['books'],
            queryFn: async () => {
                const response = await apiClient.get('books');
                return response.data.data as Book[];
            }
        }
    );
}

export const useUserBooks = (userId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['userBooks', userId],
        queryFn: async () => {
            const response = await apiClient.get(`books/user/${userId}`);
            return response.data.data as UserBookWithDetails[];
        },
        enabled: enabled && !!userId, // Only run query if enabled and userId is provided
        staleTime: 5 * 60 * 1000, // 5 minutes - user's book list doesn't change frequently
        retry: (failureCount, error: any) => {
            // Don't retry on authentication errors
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                return false;
            }
            return failureCount < 3;
        }
    });
}

// Hook for updating/adding a book to user's library
export const useUpdateUserBook = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: {
            userId: string;
            bookId: string;
            rating?: number;
            status?: string;
            description?: string;
            startedAt?: string;
            finishedAt?: string;
        }) => {
            const response = await apiClient.post(`books/user/${data.userId}`, {
                bookId: data.bookId,
                rating: data.rating,
                status: data.status,
                description: data.description,
                startedAt: data.startedAt,
                finishedAt: data.finishedAt
            });
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Invalidate and refetch user books
            queryClient.invalidateQueries({ queryKey: ['userBooks', variables.userId] });
        },
        onError: (error) => {
            console.error('Error updating user book:', error);
        }
    });
}

// Hook for removing a book from user's library
export const useRemoveUserBook = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: { userId: string; bookId: string }) => {
            const response = await apiClient.delete(`books/user/${data.userId}`, {
                data: { bookId: data.bookId }
            });
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Invalidate and refetch user books
            queryClient.invalidateQueries({ queryKey: ['userBooks', variables.userId] });
        },
        onError: (error) => {
            console.error('Error removing user book:', error);
        }
    });
}

// Hook for searching books
export const useSearchBooks = (query: string, authorId?: string) => {
    return useQuery({
        queryKey: ['searchBooks', query, authorId],
        queryFn: async () => {
            if (!query || query.trim().length < 2) {
                return [];
            }
            const params = new URLSearchParams({ q: query.trim() });
            if (authorId) {
                params.append('authorId', authorId);
            }
            const response = await apiClient.get(`books/search?${params.toString()}`);
            return response.data.data as Book[];
        },
        enabled: query.trim().length >= 2,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2
    });
}

// Hook for creating new books in the global library
export const useCreateBook = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (bookData: {
            title: string;
            description?: string;
            year_published?: number;
            pages?: number;
            category_id?: string;
            author_id: string;
        }) => {
            console.log('🔄 useCreateBook mutation called with:', bookData);
            const response = await apiClient.post('books', bookData);
            console.log('📚 Create book API response:', response.data);
            return response.data.data as Book;
        },
        onSuccess: (data) => {
            console.log('✅ Book creation successful:', data);
            // Invalidate and refetch books list and search results
            queryClient.invalidateQueries({ queryKey: ['books'] });
            queryClient.invalidateQueries({ queryKey: ['searchBooks'] });
        },
        onError: (error) => {
            console.error('❌ Error creating book:', error);
        }
    });
}
