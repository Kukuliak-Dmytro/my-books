import type Book from "@/types/book";
import apiClient from "@/lib/http";
import { useQuery } from "@tanstack/react-query";

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
