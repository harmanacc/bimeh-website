## Bulk Assign Product to Selected Leads

### Description

Add functionality to the lead upload preview table to allow selecting multiple rows and assigning a product type to all selected rows at once. This improves efficiency when importing leads with the same product type.

### Core Logic

- Add checkboxes to each row in the lead preview table for selection.
- Add a "Select All" checkbox in the header.
- Add a bulk action section with a product selector and "Apply to Selected" button.
- When applying, update the productName column for all selected rows.
- Ensure the product selector uses the existing products API.
- Maintain existing functionality for individual row editing.

### Relations to Code Files

- Preview component: [`src/components/admin/outreach/lead-preview-table.tsx`](src/components/admin/outreach/lead-preview-table.tsx)
- Products API: [`src/app/api/admin/products/route.ts`](src/app/api/admin/products/route.ts)
- Upload page: [`src/app/admin/upload-leads/page.tsx`](src/app/admin/upload-leads/page.tsx)

### Steps

1. Modify lead-preview-table.tsx to add row selection checkboxes.
2. Add bulk action UI with product selector and apply button.
3. Implement select all functionality.
4. Update handleCellChange to support bulk updates.
5. Test integration with existing upload flow.

### Tasklist

- [ ] Add row selection checkboxes to table
- [ ] Implement select all checkbox in header
- [ ] Add bulk action UI with product selector
- [ ] Implement bulk apply functionality
- [ ] Test bulk assignment with upload flow
