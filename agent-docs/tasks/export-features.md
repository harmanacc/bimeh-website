## Export Features

### Description

Implement export functionality to download leads, customers, and activity history as Excel files.

### Steps

1. Create API routes for exporting data: `src/app/api/admin/outreach/export/leads/route.ts`, etc.
2. Use SheetJS to generate Excel files from database queries.
3. Add export buttons in relevant pages/tables.
4. Handle single/multiple selections for history export.

### Tasklist

- [ ] Create export API for leads
- [ ] Create export API for customers
- [ ] Create export API for activity history
- [ ] Add export buttons in UI
- [ ] Support selected exports
