## Marketing Outreach Full Implementation

### Description

Implement the complete marketing outreach system including message templates with variable replacement, WhatsApp sending and activity logging, marketing outreach panel, and enhanced activity panels.

### Core Logic

- Message templates support {{fieldName}} variables replaced with customer/lead data
- WhatsApp links generated with encoded messages
- Activity logging on send/log actions with status updates
- Outreach panel with template selection, recipient search, message preview
- Activity history with tabs, filters, and full message display

### Relations to Code Files

- Schema: [`src/db/schema.ts`](src/db/schema.ts)
- Queries: [`src/db/queries/leads.ts`](src/db/queries/leads.ts), [`src/db/queries/customers.ts`](src/db/queries/customers.ts)
- Utility: New `/lib/template-utils.ts`
- Pages: New [`src/app/admin/outreach/messages/page.tsx`](src/app/admin/outreach/messages/page.tsx), New [`src/app/admin/activity-history/page.tsx`](src/app/admin/activity-history/page.tsx)
- Actions: Update [`src/app/admin/outreach/actions.ts`](src/app/admin/outreach/actions.ts)
- Components: New in `/components/admin/outreach/`

### Steps

1. Create template replacement utility
2. Create marketing outreach messages page
3. Add WhatsApp sending and logging actions
4. Create activity history page with enhancements
5. Update existing outreach actions
6. Test full flow

### Tasklist

- [ ] Create template replacement utility function
- [ ] Define supported fields mapping
- [ ] Handle missing fields gracefully
- [ ] Create outreach messages page with template selection
- [ ] Add recipient search/select functionality
- [ ] Implement message preview with variables
- [ ] Add send button (wa.me link)
- [ ] Add log activity button
- [ ] Implement activity logging with status updates
- [ ] Create activity history page
- [ ] Add tabs for lead and customer activities
- [ ] Implement filters (date, phone, name)
- [ ] Update table to show full message
- [ ] Add related data columns
- [ ] Test variable replacement
- [ ] Test full outreach flow
- [ ] Test activity history display and filtering
