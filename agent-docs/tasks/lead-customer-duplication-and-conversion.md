# Lead and Customer Phone Duplication Prevention and Conversion Logic

## Description

This task addresses the requirement to prevent phone number duplicates across both leads and customers tables, and ensures that when a lead is converted to a customer, the lead record is deleted from the leads table. Currently, the schema has unique constraints per table, but not across tables, and conversion logic may not delete the lead.

## Core Logic

- Modify database schema to enforce phone number uniqueness across leads and customers tables (possibly using a partial unique index or trigger, but since Drizzle, we may need to adjust constraints).
- Update all creation functions for leads and customers to check for existing phone numbers in both tables.
- Update conversion logic to delete the lead record after creating the customer.

## Relations to Code Files

- `src/db/schema.ts`: Database schema definitions for leads and customers tables.
- `src/app/admin/outreach/actions.ts`: Server actions for creating leads and customers, and conversion.
- `src/app/api/admin/outreach/leads/route.ts`: API for lead creation.
- `src/app/api/admin/outreach/customers/route.ts`: API for customer creation.
- `src/components/admin/outreach/lead-add-form.tsx`: Form for adding leads.
- `src/components/admin/outreach/customer-add-form.tsx`: Form for adding customers.
- Any conversion functions in outreach actions.

## Steps

1. Analyze current schema and identify changes needed for cross-table uniqueness.
2. Update schema.ts to implement phone uniqueness across tables.
3. Update lead creation logic to check both tables.
4. Update customer creation logic to check both tables.
5. Update lead-to-customer conversion to delete lead after creation.
6. Test the changes.

## Tasklist

- [ ] Review current schema and uniqueness constraints
- [ ] Modify schema for cross-table phone uniqueness
- [ ] Update lead creation functions
- [ ] Update customer creation functions
- [ ] Update conversion logic to delete lead
- [ ] Verify implementation
