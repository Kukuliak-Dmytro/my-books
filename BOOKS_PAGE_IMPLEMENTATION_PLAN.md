# Books Page Implementation Plan

## Overview
This document outlines the implementation plan for enhancing the existing rating page to display all books in the database. The implementation follows the established pattern used in the authors page and leverages existing components, services, and infrastructure.

**Note**: The books display functionality will be added to the existing rating page (`src/app/(home)/rating/page.tsx`) rather than creating a new books page.

## Current State Analysis

### ✅ Already Implemented
- **Book Type Definition** (`src/types/book.ts`)
  - Complete interface with all necessary fields
  - Proper TypeScript typing

- **Backend API Infrastructure**
  - API route handler (`src/app/api/books/route.ts`)
  - Database service layer (`src/app/api/lib/books.ts`)
  - formatAPIRESPONSE utility integration
  - GET endpoint for fetching all books

- **Book Card Component** (`src/components/cards/BookCard.tsx`)
  - Basic structure implemented
  - All book fields displayed
  - Image component for cover display

- **Frontend Service Foundation** (`src/services/book.ts`)
  - Basic getAllBooks function structure
  - API client integration started

### 🔄 Needs Completion/Enhancement

## Implementation Plan

### Phase 1: Implement useBooks Hook
**Priority: High**

#### 1.1 Enhance Book Service (`src/services/book.ts`)
- [ ] Remove the incomplete `getAllBooks` function
- [ ] Implement `useBooks` React Query hook directly (following useAuthors pattern)
- [ ] Add proper response data extraction (`response.data.data`)
- [ ] Add error handling and TypeScript typing
- [ ] Follow the exact pattern from `src/services/author.ts`

**Implementation Details:**
```typescript
// Expected structure based on authors pattern:
export const useBooks = () => {
    return useQuery({
        queryKey: ['books'],
        queryFn: async () => {
            const response = await apiClient.get('books');
            return response.data.data as Book[];
        }
    });
}
```

#### 1.2 Create Book Creation Service (Optional Enhancement)
- [ ] Add `createBook` function for future book addition functionality
- [ ] Implement form validation patterns
- [ ] Add proper error handling

### Phase 2: Enhance Book Card Component
**Priority: Medium**

#### 2.1 Improve BookCard Design (`src/components/cards/BookCard.tsx`)
- [ ] Align styling with AuthorCard component pattern
- [ ] Add proper CSS classes for consistent theming
- [ ] Implement responsive design
- [ ] Add hover effects and visual polish
- [ ] Handle missing cover images gracefully
- [ ] Format dates properly
- [ ] Add rating display (stars/visual indicator)

**Design Requirements:**
- Follow the same card layout pattern as AuthorCard
- Use background, shadow, and spacing classes consistently
- Implement proper image aspect ratio and fallbacks
- Add semantic HTML structure

#### 2.2 Enhance Data Display
- [ ] Format publish date to readable format
- [ ] Convert author and category IDs to readable names (future enhancement)
- [ ] Add visual rating display (stars, progress bar, etc.)
- [ ] Optimize image loading and sizing

### Phase 3: Create Books Page Component
**Priority: High**

#### 3.1 Enhance Rating Page (`src/app/(home)/rating/page.tsx`)
- [ ] Transform the existing rating page to display books
- [ ] Follow exact structure pattern from authors page
- [ ] Implement client-side component
- [ ] Add proper imports for all required components
- [ ] Integrate with useBooks hook
- [ ] Use ReusableList component for books display

**Required Imports:**
```typescript
"use client"
import Section from "@/components/layout/Section"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useBooks } from "@/services/book"
import ReusableList from "@/components/layout/ReusableList"
import BookCard from "@/components/cards/BookCard"
import { useQueryClient } from "@tanstack/react-query"
```

#### 3.2 Implement Core Functionality
- [ ] Books data fetching and display
- [ ] Loading states management
- [ ] Error handling and display
- [ ] Refresh functionality
- [ ] Empty state handling

#### 3.3 Add Book Creation Form (Optional)
- [ ] Accordion-based form (following authors pattern)
- [ ] Form validation with react-hook-form
- [ ] File upload for book covers
- [ ] Author and category selection dropdowns
- [ ] Date picker for publish date
- [ ] Form submission and query invalidation

### Phase 4: Backend Enhancements
**Priority: Low (Already Mostly Complete)**

#### 4.1 Verify Database Integration
- [ ] Ensure proper book table schema
- [ ] Verify foreign key relationships (authors, categories)
- [ ] Add database indexes for performance
- [ ] Test query performance

#### 4.2 Add Book Creation Endpoint (If needed)
- [ ] POST handler in books route
- [ ] Validation middleware
- [ ] Image upload handling
- [ ] Database insertion logic

### Phase 5: Advanced Features (Future Enhancements)
**Priority: Low**

#### 5.1 Search and Filtering
- [ ] Search books by title, author
- [ ] Filter by category, rating, publish date
- [ ] Sort functionality (date, rating, title)

#### 5.2 Enhanced Data Display
- [ ] Author name resolution (join with authors table)
- [ ] Category name resolution
- [ ] Book statistics and analytics

#### 5.3 Book Management
- [ ] Edit book functionality
- [ ] Delete book functionality
- [ ] Bulk operations

## Technical Implementation Details

### File Structure
```
src/
├── app/(home)/books/
│   └── page.tsx                 # Main books page component
├── components/cards/
│   └── BookCard.tsx            # Enhanced book card component
├── services/
│   └── book.ts                 # Complete book service with hooks
├── types/
│   └── book.ts                 # (Already complete)
└── app/api/
    ├── books/route.ts          # (Already complete)
    └── lib/books.ts            # (Already complete)
```

### Key Integration Points

#### 1. ReusableList Component Usage
```typescript
<ReusableList
    items={books || []}
    CardComponent={BookCard}
    error={error}
    isLoading={isLoading}
    getKey={(book) => book.id}
/>
```

#### 2. Query Management
- Use React Query for caching and state management
- Implement proper query invalidation
- Handle loading and error states
- Add optimistic updates for mutations

#### 3. Styling Consistency
- Follow existing design system
- Use consistent spacing and typography
- Implement responsive design patterns
- Maintain theme compatibility

## Success Criteria

### Minimum Viable Product (MVP)
- [ ] Books page displays all books from database
- [ ] Loading states work correctly
- [ ] Error handling is implemented
- [ ] Refresh functionality works
- [ ] Card display is visually consistent
- [ ] Navigation and routing work properly

### Enhanced Version
- [ ] Book creation form is functional
- [ ] Form validation works correctly
- [ ] Image upload is implemented
- [ ] Query optimization is complete
- [ ] Search and filter capabilities

## Testing Strategy

### Unit Tests
- [ ] Test book service functions
- [ ] Test BookCard component rendering
- [ ] Test form validation logic

### Integration Tests
- [ ] Test API endpoint functionality
- [ ] Test database operations
- [ ] Test complete user workflows

### Manual Testing
- [ ] Test all user interactions
- [ ] Verify responsive design
- [ ] Test error scenarios
- [ ] Performance testing

## Dependencies

### Required Packages (Already Available)
- @tanstack/react-query
- react-hook-form
- lucide-react
- Next.js 14+
- TypeScript

### External Dependencies
- Database connection (PostgreSQL)
- Image storage solution (for book covers)
- API client configuration

## Risk Assessment

### High Risk
- Image handling and storage for book covers
- Database performance with large book collections
- Form complexity for book creation

### Medium Risk
- UI consistency across different screen sizes
- Error handling edge cases
- Query optimization

### Low Risk
- Basic CRUD operations
- Component integration
- TypeScript type safety

## Timeline Estimation

### Phase 1 (Frontend Service): 2-3 hours
- Complete book service implementation
- Add React Query hooks
- Test API integration

### Phase 2 (Component Enhancement): 3-4 hours
- Enhance BookCard component
- Implement proper styling
- Add image handling

### Phase 3 (Page Creation): 4-5 hours
- Create main books page
- Implement all core functionality
- Add form (if required)

### Phase 4 (Testing & Polish): 2-3 hours
- Test all functionality
- Fix bugs and edge cases
- Performance optimization

**Total Estimated Time: 11-15 hours**

## Next Steps

1. **Start with Phase 1**: Complete the frontend service layer as it's the foundation for everything else
2. **Focus on MVP first**: Get basic functionality working before adding advanced features
3. **Follow existing patterns**: Maintain consistency with the authors implementation
4. **Test incrementally**: Test each phase before moving to the next

This plan ensures a systematic approach to implementing the books page while leveraging existing infrastructure and maintaining code quality and consistency.