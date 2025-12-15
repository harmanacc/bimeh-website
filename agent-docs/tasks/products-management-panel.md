# Products Management Panel

## Description

Create a comprehensive products management panel for the BIM760 admin interface. This includes a table view of all products, a modal for adding/editing/deleting products, and backend API endpoints. Products have keywords for identification in XLSX imports, and support soft deletion via active state.

## Core Logic

- Products table with columns: id, name, type, description, coveragePoints (JSON), premiumStart/End, keywords (comma-separated), isActive, timestamps
- Keywords field for flexible matching in XLSX imports (partial matches, multiple keywords)
- Soft delete: set isActive=false instead of hard delete
- Modal for CRUD operations with form validation
- API endpoints: GET /api/admin/products, POST/PUT/DELETE for management
- Update import logic to use keywords for product matching
- Persian RTL support for admin panel

## Relations to Code Files

- `src/db/schema.ts`: productsTable (add keywords field)
- `src/app/api/admin/products/route.ts`: CRUD endpoints
- `src/app/api/admin/outreach/import/route.ts`: Update product matching logic
- `src/app/admin/products/page.tsx`: New products panel page
- `src/components/admin/products/`: New components (table, modal, form)
- `src/components/admin/sidebar.tsx`: Add products link

## Steps

1. Update productsTable schema to include keywords field
2. Create DB migration for keywords column
3. Implement CRUD API endpoints for products
4. Create products management page with table and modal
5. Add products link to admin sidebar
6. Update XLSX import logic to match products by keywords
7. Test product creation, editing, soft delete, and import matching

## Tasklist

- [ ] Update productsTable schema with keywords field
- [ ] Generate and run DB migration
- [ ] Implement GET products API endpoint
- [ ] Implement POST/PUT/DELETE products API endpoints
- [ ] Create products management page component
- [ ] Create products table component
- [ ] Create product modal component (add/edit/delete)
- [ ] Add products navigation to sidebar
- [ ] Update import route to use keywords for product matching
- [ ] Test full CRUD functionality and import integration
