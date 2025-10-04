"use client";

import { useState, useEffect } from 'react';
import { useSearchBooks } from '@/services/book';
import { useSearchAuthors } from '@/services/author';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type Book from '@/types/book';
import type { Author } from '@/types/author';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookSelected: (book: Book, userData?: UserBookData) => void;
  onCreateNewBook: (bookData: Partial<Book>, userData?: UserBookData) => void;
}

interface UserBookData {
  rating?: number;
  status?: 'wishlist' | 'reading' | 'completed' | 'paused' | 'dropped';
  description?: string;
  startedAt?: string;
  finishedAt?: string;
}

export default function AddBookModal({ 
  isOpen, 
  onClose, 
  onBookSelected, 
  onCreateNewBook 
}: AddBookModalProps) {
  const [bookQuery, setBookQuery] = useState('');
  const [authorQuery, setAuthorQuery] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [showCreateBook, setShowCreateBook] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  
  // New book form data
  const [newBookData, setNewBookData] = useState({
    title: '',
    pages: '',
    coverUrl: '',
    publishDate: '',
    annptation: ''
  });

  // User-specific book data
  const [userBookData, setUserBookData] = useState<UserBookData>({
    rating: undefined,
    status: 'wishlist',
    description: '',
    startedAt: '',
    finishedAt: ''
  });

  // Search hooks
  const { 
    data: bookResults = [], 
    isLoading: isSearchingBooks 
  } = useSearchBooks(bookQuery, selectedAuthor?.id);
  
  const { 
    data: authorResults = [], 
    isLoading: isSearchingAuthors 
  } = useSearchAuthors(authorQuery);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setBookQuery('');
      setAuthorQuery('');
      setSelectedAuthor(null);
      setShowCreateBook(false);
      setShowUserDetails(false);
      setNewBookData({
        title: '',
        pages: '',
        coverUrl: '',
        publishDate: '',
        annptation: ''
      });
      setUserBookData({
        rating: undefined,
        status: 'wishlist',
        description: '',
        startedAt: '',
        finishedAt: ''
      });
    }
  }, [isOpen]);

  const handleAuthorSelect = (author: Author) => {
    setSelectedAuthor(author);
    setAuthorQuery(author.full_name);
  };

  const handleBookSelect = (book: Book) => {
    if (showUserDetails) {
      // Clean up user data - remove empty strings and undefined values
      const cleanUserData = Object.fromEntries(
        Object.entries(userBookData).filter(([_, value]) => 
          value !== '' && value !== undefined && value !== null
        )
      ) as UserBookData;
      
      onBookSelected(book, cleanUserData);
    } else {
      onBookSelected(book);
    }
    onClose();
  };

  const handleCreateNewBook = () => {
    console.log('🆕 Creating new book...');
    console.log('📝 newBookData:', newBookData);
    console.log('👤 selectedAuthor:', selectedAuthor);
    console.log('📚 bookQuery:', bookQuery);
    
    const bookData = {
      title: newBookData.title || bookQuery,
      pages: newBookData.pages ? parseInt(newBookData.pages) : undefined,
      coverUrl: newBookData.coverUrl || undefined,
      publishDate: newBookData.publishDate || undefined,
      annptation: newBookData.annptation || undefined,
      authorId: selectedAuthor?.id || undefined,
    };

    console.log('📖 Constructed bookData:', bookData);

    // Clean up user data
    const cleanUserData = Object.fromEntries(
      Object.entries(userBookData).filter(([_, value]) => 
        value !== '' && value !== undefined && value !== null
      )
    ) as UserBookData;

    console.log('👤 Cleaned user data:', cleanUserData);

    onCreateNewBook(bookData, cleanUserData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add Book to Library</h2>
            <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </Button>
          </div>

          {!showCreateBook ? (
            <div className="space-y-6">
              {/* Author Search */}
              <div>
                <Label htmlFor="author-search">Search Author (Optional)</Label>
                <Input
                  id="author-search"
                  type="text"
                  placeholder="Type author name..."
                  value={authorQuery}
                  onChange={(e) => {
                    setAuthorQuery(e.target.value);
                    if (e.target.value !== selectedAuthor?.full_name) {
                      setSelectedAuthor(null);
                    }
                  }}
                  className="mt-1"
                />
                
                {/* Author Results */}
                {authorQuery.length >= 2 && !selectedAuthor && (
                  <div className="mt-2 border border-gray-200 rounded-md max-h-40 overflow-y-auto">
                    {isSearchingAuthors ? (
                      <div className="p-3 text-gray-500">Searching authors...</div>
                    ) : authorResults.length > 0 ? (
                      authorResults.map((author) => (
                        <button
                          key={author.id}
                          onClick={() => handleAuthorSelect(author)}
                          className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium">{author.full_name}</div>
                          {author.description && (
                            <div className="text-sm text-gray-500 truncate">{author.description}</div>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500">
                        No authors found. You can create a new author when creating a book.
                      </div>
                    )}
                  </div>
                )}

                {selectedAuthor && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex items-center justify-between">
                    <span className="text-green-700">✓ {selectedAuthor.full_name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedAuthor(null);
                        setAuthorQuery('');
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>

              {/* Book Search */}
              <div>
                <Label htmlFor="book-search">Search Book Title</Label>
                <Input
                  id="book-search"
                  type="text"
                  placeholder="Type book title..."
                  value={bookQuery}
                  onChange={(e) => setBookQuery(e.target.value)}
                  className="mt-1"
                />

              {/* User Book Details Toggle */}
              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Add personal details?</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUserDetails(!showUserDetails)}
                  >
                    {showUserDetails ? '👁️ Hide Details' : '📝 Add Details'}
                  </Button>
                </div>
                
                {showUserDetails && (
                  <div className="space-y-3 mt-3">
                    {/* Status */}
                    <div>
                      <Label htmlFor="user-status" className="text-xs">Reading Status</Label>
                      <select
                        id="user-status"
                        value={userBookData.status}
                        onChange={(e) => setUserBookData(prev => ({ 
                          ...prev, 
                          status: e.target.value as UserBookData['status']
                        }))}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md"
                        title="Select reading status"
                      >
                        <option value="wishlist">📝 Wishlist</option>
                        <option value="reading">📖 Reading</option>
                        <option value="completed">✅ Completed</option>
                        <option value="paused">⏸️ Paused</option>
                        <option value="dropped">❌ Dropped</option>
                      </select>
                    </div>

                    {/* Rating */}
                    <div>
                      <Label className="text-xs">My Rating (Optional)</Label>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserBookData(prev => ({ 
                              ...prev, 
                              rating: star === userBookData.rating ? undefined : star 
                            }))}
                            className={`text-lg hover:scale-110 transition-transform ${
                              star <= (userBookData.rating || 0) 
                                ? 'text-yellow-400' 
                                : 'text-gray-300 hover:text-yellow-200'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                        {userBookData.rating && (
                          <span className="text-xs text-gray-500 ml-2">({userBookData.rating}/5)</span>
                        )}
                      </div>
                    </div>

                    {/* Personal Notes */}
                    <div>
                      <Label htmlFor="user-description" className="text-xs">Personal Notes</Label>
                      <textarea
                        id="user-description"
                        value={userBookData.description}
                        onChange={(e) => setUserBookData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Your thoughts, notes, or comments about this book..."
                        className="w-full p-2 text-sm border border-gray-300 rounded-md resize-none"
                        rows={2}
                      />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="user-started" className="text-xs">Started Date</Label>
                        <Input
                          id="user-started"
                          type="date"
                          value={userBookData.startedAt}
                          onChange={(e) => setUserBookData(prev => ({ ...prev, startedAt: e.target.value }))}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="user-finished" className="text-xs">Finished Date</Label>
                        <Input
                          id="user-finished"
                          type="date"
                          value={userBookData.finishedAt}
                          onChange={(e) => setUserBookData(prev => ({ ...prev, finishedAt: e.target.value }))}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
                
                {/* Book Results */}
                {bookQuery.length >= 2 && (
                  <div className="mt-2 border border-gray-200 rounded-md max-h-60 overflow-y-auto">
                    {isSearchingBooks ? (
                      <div className="p-3 text-gray-500">Searching books...</div>
                    ) : bookResults.length > 0 ? (
                      bookResults.map((book) => (
                        <button
                          key={book.id}
                          onClick={() => handleBookSelect(book)}
                          className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium">{book.title}</div>
                          <div className="text-sm text-gray-500">
                            by {book.authorName} • {book.categoryName}
                          </div>
                          {book.annptation && (
                            <div className="text-sm text-gray-400 truncate mt-1">{book.annptation}</div>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="p-3">
                        <div className="text-gray-500 mb-2">No books found with that title.</div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowCreateBook(true)}
                        >
                          📚 Create New Book "{bookQuery}"
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Manual Create Button */}
              {bookQuery.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateBook(true)}
                    className="w-full"
                  >
                    📝 Create New Book
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Create New Book Form */
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Create New Book</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowCreateBook(false)}
                >
                  ← Back to Search
                </Button>
              </div>

              <div>
                <Label htmlFor="new-title">Title *</Label>
                <Input
                  id="new-title"
                  value={newBookData.title || bookQuery}
                  onChange={(e) => setNewBookData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Book title"
                />
              </div>

              <div>
                <Label htmlFor="new-pages">Pages</Label>
                <Input
                  id="new-pages"
                  type="number"
                  value={newBookData.pages}
                  onChange={(e) => setNewBookData(prev => ({ ...prev, pages: e.target.value }))}
                  placeholder="Number of pages"
                />
              </div>

              <div>
                <Label htmlFor="new-cover">Cover URL</Label>
                <Input
                  id="new-cover"
                  value={newBookData.coverUrl}
                  onChange={(e) => setNewBookData(prev => ({ ...prev, coverUrl: e.target.value }))}
                  placeholder="https://example.com/book-cover.jpg"
                />
              </div>

              <div>
                <Label htmlFor="new-publish-date">Publish Date</Label>
                <Input
                  id="new-publish-date"
                  type="date"
                  value={newBookData.publishDate}
                  onChange={(e) => setNewBookData(prev => ({ ...prev, publishDate: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="new-annotation">Description</Label>
                <textarea
                  id="new-annotation"
                  value={newBookData.annptation}
                  onChange={(e) => setNewBookData(prev => ({ ...prev, annptation: e.target.value }))}
                  placeholder="Brief description of the book"
                  className="w-full p-2 border border-gray-300 rounded-md resize-none"
                  rows={3}
                />
              </div>

              {selectedAuthor && (
                <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                  <span className="text-green-700 text-sm">Author: {selectedAuthor.full_name}</span>
                </div>
              )}

              {/* User Book Details for New Book */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Personal Library Details</h4>
                
                <div className="space-y-3">
                  {/* Status */}
                  <div>
                    <Label htmlFor="new-user-status" className="text-xs">Reading Status</Label>
                    <select
                      id="new-user-status"
                      value={userBookData.status}
                      onChange={(e) => setUserBookData(prev => ({ 
                        ...prev, 
                        status: e.target.value as UserBookData['status']
                      }))}
                      className="w-full p-2 text-sm border border-gray-300 rounded-md"
                      title="Select reading status"
                    >
                      <option value="wishlist">📝 Wishlist</option>
                      <option value="reading">📖 Reading</option>
                      <option value="completed">✅ Completed</option>
                      <option value="paused">⏸️ Paused</option>
                      <option value="dropped">❌ Dropped</option>
                    </select>
                  </div>

                  {/* Rating */}
                  <div>
                    <Label className="text-xs">My Rating (Optional)</Label>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserBookData(prev => ({ 
                            ...prev, 
                            rating: star === userBookData.rating ? undefined : star 
                          }))}
                          className={`text-lg hover:scale-110 transition-transform ${
                            star <= (userBookData.rating || 0) 
                              ? 'text-yellow-400' 
                              : 'text-gray-300 hover:text-yellow-200'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                      {userBookData.rating && (
                        <span className="text-xs text-gray-500 ml-2">({userBookData.rating}/5)</span>
                      )}
                    </div>
                  </div>

                  {/* Personal Notes */}
                  <div>
                    <Label htmlFor="new-user-description" className="text-xs">Personal Notes</Label>
                    <textarea
                      id="new-user-description"
                      value={userBookData.description}
                      onChange={(e) => setUserBookData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Your thoughts, notes, or comments about this book..."
                      className="w-full p-2 text-sm border border-gray-300 rounded-md resize-none"
                      rows={2}
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="new-user-started" className="text-xs">Started Date</Label>
                      <Input
                        id="new-user-started"
                        type="date"
                        value={userBookData.startedAt}
                        onChange={(e) => setUserBookData(prev => ({ ...prev, startedAt: e.target.value }))}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-user-finished" className="text-xs">Finished Date</Label>
                      <Input
                        id="new-user-finished"
                        type="date"
                        value={userBookData.finishedAt}
                        onChange={(e) => setUserBookData(prev => ({ ...prev, finishedAt: e.target.value }))}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleCreateNewBook}
                  disabled={!newBookData.title && !bookQuery}
                  className="flex-1"
                >
                  Create & Add to Library
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateBook(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}