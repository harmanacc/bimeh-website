# Customer Notes Panel

## Overview

This task implements a customer notes panel for the admin customer detail page, allowing administrators to add, edit, and delete free-form notes about customers. The panel provides a chat-like interface for tracking important information and interactions with customers.

## Core Logic

- **Customer Notes Management**: Create, read, update, and delete customer notes with real-time validation
- **Note Organization**: Notes are displayed in reverse chronological order (newest first)
- **Inline Editing**: Notes can be edited directly in the list with save/cancel functionality
- **User Experience**: Toast notifications for all operations, relative time display, and responsive design
- **RTL Support**: Full Persian RTL layout support for the Iranian market

## Relations to Code Files

- **Database**: `src/db/queries/customer-notes.ts` - CRUD operations for customer notes
- **API**: `src/app/api/admin/outreach/customers/[id]/notes/route.ts` - REST endpoints for notes
- **Component**: `src/components/admin/outreach/customer-notes-panel.tsx` - React component with UI
- **Integration**: `src/app/admin/outreach/customers/[id]/page.tsx` - Integrated into customer detail page

## Steps

1. **Create Database Queries** (`src/db/queries/customer-notes.ts`)

   - Implement `getCustomerNotes()` to fetch all notes for a customer
   - Implement `createCustomerNote()` to add new notes
   - Implement `updateCustomerNote()` to edit existing notes
   - Implement `deleteCustomerNote()` to remove notes
   - Use proper TypeScript types and error handling

2. **Create API Endpoints** (`src/app/api/admin/outreach/customers/[id]/notes/route.ts`)

   - Implement GET endpoint to fetch customer notes
   - Implement POST endpoint to create new notes
   - Implement PUT endpoint to update existing notes
   - Implement DELETE endpoint to remove notes
   - Add authentication and validation middleware
   - Handle error responses appropriately

3. **Create React Component** (`src/components/admin/outreach/customer-notes-panel.tsx`)

   - Build a card-based interface with notes list
   - Implement add note functionality with textarea and validation
   - Add inline editing with save/cancel buttons
   - Include delete functionality with confirmation
   - Display relative timestamps (e.g., "2 hours ago")
   - Add proper RTL styling for Persian interface
   - Implement toast notifications for user feedback

4. **Integrate into Customer Detail Page** (`src/app/admin/outreach/customers/[id]/page.tsx`)
   - Import the new CustomerNotesPanel component
   - Add the component to the customer detail page layout
   - Position it appropriately in the responsive grid
   - Pass the customer ID as a prop

## Tasklist

- [ ] Create database queries for customer notes CRUD operations
- [ ] Implement API endpoints with proper authentication and validation
- [ ] Build the React component with complete UI and functionality
- [ ] Add the component to the customer detail page
- [ ] Test all CRUD operations and user interactions
- [ ] Verify RTL layout and Persian text display
- [ ] Ensure responsive design works on mobile and desktop
