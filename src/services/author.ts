import apiClient from "@/lib/http";
import { Author } from "@/types/author";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export async function createAuthor(author: Partial<Author>): Promise<Author> {

    const newAuthor = await apiClient.post('authors', {
        full_name: author.full_name,
        dob: author.dob,
        description: author.description
    })
    if (!newAuthor) {
        throw new Error('Failed to create author');
    }
    return newAuthor.data.data;

}
export const useAuthors = () => {
    return useQuery(
        {
            queryKey: ['authors'],
            queryFn: async () => {
                const response = await apiClient.get('authors');
                return response.data.data as Author[];
            }
        }
    );
}

// Hook for searching authors
export const useSearchAuthors = (query: string) => {
    return useQuery({
        queryKey: ['searchAuthors', query],
        queryFn: async () => {
            if (!query || query.trim().length < 2) {
                return [];
            }
            const response = await apiClient.get(`authors/search?q=${encodeURIComponent(query.trim())}`);
            return response.data.data as Author[];
        },
        enabled: query.trim().length >= 2,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2
    });
}
