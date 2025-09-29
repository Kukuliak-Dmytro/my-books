import type { Author } from '@/types/author'; // Assuming you have this type

export default function AuthorCard(author: Partial<Author>) {
    return(
        <div className="p-2 flex flex-col gap-1 bg-background rounded-md shadow-md">
            <div className="flex justify-between items-center">
                <h3 className='text-lg font-semibold'>{author.full_name}</h3>
                <span>
                    {author.dob ? new Date(author.dob).toLocaleDateString() : ''}
                </span>
            </div>
            <p className='text-md text-foreground/80 pl-4'>{author.description}</p>
        
        </div>
    )
}