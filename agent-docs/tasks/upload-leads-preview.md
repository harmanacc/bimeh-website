## Upload Leads with Preview

### Description

Create an admin page for uploading leads from Excel files with an interactive preview. The page allows file upload, parsing, displaying data in an editable shadcn table for preview, enabling users to add/remove rows and columns, validate against database schema, and only insert confirmed data into the database. Support Persian RTL layout and provide user feedback.

### Core Logic

- Use SheetJS (xlsx) library to parse Excel files.
- Display parsed data in an editable shadcn DataTable component.
- Allow users to add/remove rows and columns in the preview.
- Validate columns to match database lead schema (e.g., name, phone, email).
- Normalize phone numbers to international format (e.g., +98912...).
- Handle duplicates and required fields validation.
- On user confirmation, insert valid leads into database using Drizzle ORM.
- Provide progress feedback, error handling, and toasts.

### Relations to Code Files

- Database schema: [`src/db/schema.ts`](src/db/schema.ts)
- Database queries: [`src/db/queries/leads.ts`](src/db/queries/leads.ts)
- API route: [`src/app/api/admin/outreach/import/route.ts`](src/app/api/admin/outreach/import/route.ts)
- Page: [`src/app/admin/upload-leads/page.tsx`](src/app/admin/upload-leads/page.tsx)
- Preview component: [`src/components/admin/outreach/lead-preview-table.tsx`](src/components/admin/outreach/lead-preview-table.tsx)

### Steps

1. Create the upload page at `src/app/admin/upload-leads/page.tsx` with file input, upload button, and preview area.
2. Implement API route `src/app/api/admin/outreach/import/route.ts` for handling multipart form data and initial parsing.
3. Add SheetJS dependency to `package.json` if not present.
4. Create editable preview table component `src/components/admin/outreach/lead-preview-table.tsx` using shadcn DataTable.
5. Parse Excel file, map columns to lead fields, normalize phones, display in table.
6. Implement add/remove row/column functionality in preview table.
7. Validate data: check for required fields, unique phones, column matches.
8. On confirm, insert valid leads into database, handle errors and duplicates.
9. Add progress bar, success/error messages using shadcn/ui toasts.

### Tasklist

- [x] Create upload page with file input and preview area
- [x] Implement API route for file upload and parsing
- [x] Add SheetJS dependency
- [x] Create editable preview table component
- [x] Parse Excel and display in table
- [x] Implement add/remove rows and columns in preview
- [x] Validate data and column matches
- [x] Insert leads to database on confirm
- [x] Add progress feedback and notifications
