"use client"
import Section from "@/components/layout/Section"
import { Button } from "@/components/ui/button"
import { useBooks } from "@/services/book"
import ReusableList from "@/components/layout/ReusableList"
import BookCard from "@/components/cards/BookCard"
import { useQueryClient } from "@tanstack/react-query"

export default function Rating() {
    const { data: books, isLoading, error, isFetching } = useBooks()
    const queryClient = useQueryClient()

    return (
        <Section>
            <h1>Books Rating</h1>
            <div className="mt-8 mb-4 flex justify-between items-center">
                <p>List of books will be displayed here.</p>
                <Button 
                    type='button' 
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['books'] })} 
                    className='w-[150px]'
                >
                    {isFetching ? "Loading..." : "Refresh"}
                </Button>
            </div>

            <ReusableList
                items={books || []}
                CardComponent={BookCard}
                error={error}
                isLoading={isLoading}
                getKey={(book) => book.id}
            />
        </Section>
    )
}