import apiClient from "@/lib/http";
import { Author } from "@/types/author";
import { useQuery } from "@tanstack/react-query";
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
