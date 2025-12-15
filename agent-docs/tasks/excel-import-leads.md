## Excel Import for Leads

### Description

Build functionality to import leads from Excel files, parse data, normalize phone numbers, and store in leads table.

### Steps

1. Create admin page for file upload at `src/app/admin/outreach/import/page.tsx`.
2. Implement API route `src/app/api/admin/outreach/import/route.ts` to handle file upload and parsing.
3. Use SheetJS to parse Excel, validate columns, normalize phones to international format.
4. Insert valid leads into database, handle duplicates and errors.
5. Provide progress feedback and success/error messages.

### Tasklist

- [ ] Create import page with file input and upload button
- [ ] Implement API route for multipart form data handling
- [ ] Add SheetJS dependency if not present
- [ ] Parse Excel and map columns to lead fields
- [ ] Normalize phone numbers (e.g., 0912... to 98912...)
- [ ] Validate data: unique phones, required fields
- [ ] Insert leads to database with error handling
- [ ] Add progress bar and toast notifications
