## Database Schema for Outreach

### Description

Define database tables for leads, customers, and activities to support the marketing outreach panel. Align with existing schema patterns using Drizzle ORM.

### Steps

1. Update `src/db/schema.ts` to add leads, customers, and activities tables with appropriate fields and relations.
2. Add TypeScript types for the new tables.
3. Run database migration to apply schema changes.

### Tasklist

- [ ] Add leads table with fields: id, firstName, lastName, phone, insuranceType, importedAt
- [ ] Add customers table with fields: id, leadId, firstName, lastName, phone, etc., linked to leads
- [ ] Add activities table with fields: id, customerId, messageText, isAiGenerated, sentAt, sentBy, status, notes
- [ ] Define relations between tables
- [ ] Add inferred types for new tables
- [ ] Run drizzle-kit migration
