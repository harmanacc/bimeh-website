# Phone Number Handling

## Description

Implement comprehensive phone number utilities and validation for the BIM760 application. This includes normalization for database storage (09 format), input transformation from international formats (+989), validation on data entry, and conversion for WhatsApp messaging links. The system must handle phone numbers consistently across lead insertion, bulk import, customer management, and search functionalities.

## Core Logic

- **Storage Format**: Phone numbers stored in database as `09211234567` (09 prefix followed by 9 digits)
- **Input Transformation**: Convert international format `+989211234567` to local format `09211234567`
- **Validation**: Ensure phone numbers are in valid 09 format (09 + 9 digits) during data entry
- **WhatsApp Integration**: Convert stored 09 format to international `+989` format for WhatsApp message links
- **Consistency**: Apply across all phone number operations: single/bulk insertion, searching, and messaging

## Relations to Code Files

- [`src/db/schema.ts`](src/db/schema.ts) - Database schema for leads/customers phone fields
- [`src/app/api/admin/outreach/leads/route.ts`](src/app/api/admin/outreach/leads/route.ts) - Lead insertion API
- [`src/app/api/admin/outreach/import/route.ts`](src/app/api/admin/outreach/import/route.ts) - Bulk import API
- [`src/components/admin/outreach/lead-add-form.tsx`](src/components/admin/outreach/lead-add-form.tsx) - Lead form component
- [`src/components/admin/outreach/customer-add-form.tsx`](src/components/admin/outreach/customer-add-form.tsx) - Customer form component
- [`src/db/queries/leads.ts`](src/db/queries/leads.ts) - Lead queries including search
- [`src/db/queries/customers.ts`](src/db/queries/customers.ts) - Customer queries
- [`src/components/admin/outreach/messages-panel.tsx`](src/components/admin/outreach/messages-panel.tsx) - WhatsApp messaging component

## Steps

1. Create phone number utilities in `/lib/phone-utils.ts`
2. Create phone number validation utilities in `/lib/phone-validation.ts`
3. Update lead insertion API to use normalization and validation
4. Update bulk import API to transform and validate phone numbers
5. Update customer insertion API to use normalization and validation
6. Update search queries to handle normalized phone formats
7. Update WhatsApp messaging components to convert to international format
8. Add validation to form components for real-time feedback

## Tasklist

- [ ] Create phone number utilities file
- [ ] Create phone number validation file
- [ ] Update lead insertion API
- [ ] Update bulk import API
- [ ] Update customer insertion API
- [ ] Update search queries
- [ ] Update WhatsApp messaging components
- [ ] Add form validation
