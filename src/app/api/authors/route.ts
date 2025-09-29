import { formatAPIRESPONSE } from '@/lib/api';
import type { Author } from '@/types/author';
import { NextRequest } from 'next/server';
import { createAuthor, getAllAuthors } from '../lib/author';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, dob, description } = body;

    const author = await createAuthor({ full_name, dob, description });

    return formatAPIRESPONSE({
      data: author,
      error: null,
      message: 'Author created successfully',
      status: 201,
    });
  } catch (error: unknown) {
    console.error('Error creating author:', error);
    return formatAPIRESPONSE({
      data: null,
      error,
      message: 'Error creating author',
      status: 500,
    });
  }
}
export async function GET() {
  try {
    const authors: Author[] = await getAllAuthors();
    return formatAPIRESPONSE({
      data: authors,
      error: null,
      message: 'Authors fetched successfully',
      status: 200,
    });
  } catch (error: unknown) {
    console.error('Error fetching authors:', error);
    return formatAPIRESPONSE({
      data: null,
      error,
      message: 'Error fetching authors',
      status: 500,
    });
  }
}
