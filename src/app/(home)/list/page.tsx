"use client";

import { useEffect, useState } from 'react';
import { useUserBooks, useUpdateUserBook, useRemoveUserBook, useCreateBook } from '@/services/book';
import { getCurrentUserFromToken } from '@/services/auth';
import type { UserBookWithDetails, UserBookData } from '@/types/userBook';
import type Book from '@/types/book';
import Section from '@/components/layout/Section';
import ReusableList from '@/components/layout/ReusableList';
import AddBookModal from '@/components/AddBookModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Component to render a user book item
const UserBookItem = ({ book, onUpdate, onRemove }: { 
  book: UserBookWithDetails;
  onUpdate: (updates: Partial<UserBookWithDetails>) => void;
  onRemove: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRating, setEditedRating] = useState(book.rating || 0);
  const [editedDescription, setEditedDescription] = useState(book.description || '');

  const getStatusBadge = (status?: string) => {
    const statusStyles: { [key: string]: string } = {
      reading: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      wishlist: 'bg-purple-100 text-purple-800',
      paused: 'bg-yellow-100 text-yellow-800',
      dropped: 'bg-red-100 text-red-800'
    };

    if (!status) return null;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  const handleStatusChange = (newStatus: string) => {
    const updates: Partial<UserBookWithDetails> = { status: newStatus as any };
    
    // Auto-set dates based on status
    if (newStatus === 'reading' && !book.startedAt) {
      updates.startedAt = new Date().toISOString().split('T')[0];
    } else if (newStatus === 'completed' && !book.finishedAt) {
      updates.finishedAt = new Date().toISOString().split('T')[0];
      if (!book.startedAt) {
        updates.startedAt = new Date().toISOString().split('T')[0];
      }
    }
    
    onUpdate(updates);
  };

  const handleRatingClick = (rating: number) => {
    setEditedRating(rating);
    onUpdate({ rating });
  };

  const handleSaveDescription = () => {
    onUpdate({ description: editedDescription });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          <img
            src={book.coverUrl || '/placeholder-book.jpg'}
            alt={book.title}
            className="w-16 h-24 object-cover rounded"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-book.jpg';
            }}
          />
        </div>

        {/* Book Info */}
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {book.title}
            </h3>
            <div className="flex items-center gap-2">
              {getStatusBadge(book.status)}
              
              {/* Status Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Change Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleStatusChange('wishlist')}>
                    📝 Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange('reading')}>
                    📖 Reading
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange('paused')}>
                    ⏸️ Paused
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                    ✅ Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange('dropped')}>
                    ❌ Dropped
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Remove Button */}
              <Button 
                variant="destructive" 
                size="sm"
                onClick={onRemove}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                🗑️ Remove
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-1">by {book.authorName}</p>
          <p className="text-sm text-gray-500 mb-2">{book.categoryName}</p>

          {/* Interactive Rating */}
          <div className="flex items-center gap-1 mb-2">
            <span className="text-sm text-gray-600">My Rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  className={`text-lg hover:scale-110 transition-transform ${
                    star <= (book.rating || 0) ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            {book.rating && (
              <span className="text-sm text-gray-600">({book.rating}/5)</span>
            )}
          </div>

          {/* Reading Dates */}
          <div className="text-xs text-gray-500 space-y-1 mb-2">
            {book.startedAt && (
              <div>Started: {formatDate(book.startedAt)}</div>
            )}
            {book.finishedAt && (
              <div>Finished: {formatDate(book.finishedAt)}</div>
            )}
          </div>

          {/* Editable Notes */}
          <div className="mt-2">
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Add your thoughts about this book..."
                  className="w-full p-2 text-sm border rounded resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveDescription}>
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setEditedDescription(book.description || '');
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <p className="text-sm text-gray-700 line-clamp-2 flex-grow">
                  {book.description || 'No notes yet...'}
                </p>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setIsEditing(true)}
                  className="ml-2"
                >
                  Edit Notes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper component for ReusableList compatibility
const UserBookCard = (props: UserBookWithDetails & { 
  onUpdate: (updates: Partial<UserBookWithDetails>) => void;
  onRemove: () => void;
}) => {
  const { onUpdate, onRemove, ...bookProps } = props;
  return <UserBookItem book={bookProps} onUpdate={onUpdate} onRemove={onRemove} />;
};

export default function List() {
  const [currentUser, setCurrentUser] = useState<{ userId: string } | null>(null);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  
  const updateUserBookMutation = useUpdateUserBook();
  const removeUserBookMutation = useRemoveUserBook();
  const createBookMutation = useCreateBook();

  useEffect(() => {
    const user = getCurrentUserFromToken();
    setCurrentUser(user);
  }, []);

  const { 
    data: userBooks, 
    isLoading, 
    error, 
    isError 
  } = useUserBooks(currentUser?.userId || '', !!currentUser?.userId);

  const handleUpdateBook = (book: UserBookWithDetails, updates: Partial<UserBookWithDetails>) => {
    if (!currentUser?.userId) return;
    
    updateUserBookMutation.mutate({
      userId: currentUser.userId,
      bookId: book.bookId,
      rating: updates.rating,
      status: updates.status,
      description: updates.description,
      startedAt: updates.startedAt,
      finishedAt: updates.finishedAt
    });
  };

  const handleRemoveBook = (book: UserBookWithDetails) => {
    if (!currentUser?.userId) return;
    
    if (confirm(`Are you sure you want to remove "${book.title}" from your library?`)) {
      removeUserBookMutation.mutate({
        userId: currentUser.userId,
        bookId: book.bookId
      });
    }
  };

  // Create enhanced items with update handlers
  const enhancedUserBooks = userBooks?.map(book => ({
    ...book,
    onUpdate: (updates: Partial<UserBookWithDetails>) => handleUpdateBook(book, updates),
    onRemove: () => handleRemoveBook(book)
  })) || [];

  const handleAddExistingBook = async (book: Book, userData?: UserBookData) => {
    if (!currentUser?.userId) return;
    
    try {
      // Add existing book to user's library with user-provided data or defaults
      const userBookData = {
        userId: currentUser.userId,
        bookId: book.id,
        status: userData?.status || 'wishlist',
        rating: userData?.rating || undefined,
        description: userData?.description || undefined,
        startedAt: userData?.startedAt || undefined,
        finishedAt: userData?.finishedAt || undefined,
      };

      await updateUserBookMutation.mutateAsync(userBookData);
      
      // Close the modal on success
      setIsAddBookModalOpen(false);
      
    } catch (error) {
      console.error('Error adding existing book:', error);
      // You might want to show a user-friendly error message here
    }
  };

  const handleCreateAndAddBook = async (bookData: Partial<Book>, userData?: UserBookData) => {
    console.log('🚀 Starting handleCreateAndAddBook with:', { bookData, userData });
    
    if (!currentUser?.userId) {
      console.log('❌ No current user found');
      return;
    }
    
    try {
      console.log('📚 Creating book in global library...');
      // First create the book in the global library
      const newBook = await createBookMutation.mutateAsync({
        title: bookData.title!,
        description: bookData.annptation,
        pages: bookData.pages,
        category_id: bookData.categoryId,
        author_id: bookData.authorId!
      });

      console.log('✅ Book created:', newBook);

      // Then add it to user's library with user-provided data
      const userBookData = {
        userId: currentUser.userId,
        bookId: newBook.id,
        status: userData?.status || 'wishlist',
        rating: userData?.rating || undefined,
        description: userData?.description || undefined,
        startedAt: userData?.startedAt || undefined,
        finishedAt: userData?.finishedAt || undefined,
      };

      console.log('📖 Adding book to user library with:', userBookData);
      await updateUserBookMutation.mutateAsync(userBookData);
      
      console.log('✅ Book added to user library successfully');
      // Close the modal on success
      setIsAddBookModalOpen(false);
      
    } catch (error) {
      console.error('❌ Error creating and adding book:', error);
      // You might want to show a user-friendly error message here
    }
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-gray-500">Loading user information...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-gray-500">Loading your books...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-red-500">
          Error loading your books: {error?.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <Section>
      <div className="space-y-6 mt-[60px]">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Library</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              {userBooks?.length || 0} books in your library
            </div>
            <Button 
              onClick={() => setIsAddBookModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              📚 Add Book
            </Button>
          </div>
        </div>

        {/* Loading/Error states for mutations */}
        {(updateUserBookMutation.isPending || removeUserBookMutation.isPending) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-700 text-sm">Updating your library...</p>
          </div>
        )}
        
        {updateUserBookMutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">
              Error updating book: {updateUserBookMutation.error?.message}
            </p>
          </div>
        )}
        
        {removeUserBookMutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">
              Error removing book: {removeUserBookMutation.error?.message}
            </p>
          </div>
        )}

        {userBooks && userBooks.length > 0 ? (
          <ReusableList 
            items={enhancedUserBooks}
            CardComponent={UserBookCard}
            getKey={(book) => book.id}
            error={error}
            isLoading={isLoading}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">Your library is empty</div>
            <p className="text-gray-400">
              Start building your personal library by adding books you're reading, want to read, or have completed!
            </p>
          </div>
        )}
      </div>

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        onBookSelected={handleAddExistingBook}
        onCreateNewBook={handleCreateAndAddBook}
      />
    </Section>
  );
}