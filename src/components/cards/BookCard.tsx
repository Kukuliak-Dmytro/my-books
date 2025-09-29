import type Book from "@/types/book";
import Image from "next/image";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function BookCard(book: Partial<Book>) {
    return (
        <div className="bg-background rounded-md shadow-md">
            <Accordion type="single" collapsible>
                <AccordionItem value={`book-${book.id}`} className="border-none">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex justify-between items-center w-full">
                            <h3 className='text-lg font-semibold text-left'>{book.title}</h3>
                            <span className="text-sm text-foreground/70 ml-4">
                                ⭐ {book.rating || 'N/A'}
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Book Cover */}
                            <div className="flex-shrink-0">
                                {book.coverUrl ? (
                                    <Image 
                                        placeholder='empty' 
                                        src={book.coverUrl} 
                                        alt={book.title || 'Book cover'} 
                                        width={150} 
                                        height={225} 
                                        className="rounded-md object-cover shadow-sm"
                                    />
                                ) : (
                                    <div className="w-[150px] h-[225px] bg-muted rounded-md flex items-center justify-center">
                                        <span className="text-muted-foreground text-sm">No Cover</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Book Details */}
                            <div className="flex-1 space-y-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="font-medium text-foreground/80">Pages:</span>
                                        <span className="ml-2">{book.pages || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-foreground/80">Published:</span>
                                        <span className="ml-2">
                                            {book.publishDate ? new Date(book.publishDate).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-foreground/80">Author:</span>
                                        <span className="ml-2">{book.authorName || 'Unknown Author'}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-foreground/80">Category:</span>
                                        <span className="ml-2">{book.categoryName || 'Uncategorized'}</span>
                                    </div>
                                </div>
                                
                                {/* Book Description/Annotation */}
                                <div className="mt-4 p-3 bg-muted rounded-md">
                                    {book.annptation ? (
                                        <div>
                                            <h4 className="text-sm font-medium text-foreground mb-2">Description:</h4>
                                            <p className="text-sm text-foreground/80 leading-relaxed">
                                                {book.annptation}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">
                                            No description available for this book.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}