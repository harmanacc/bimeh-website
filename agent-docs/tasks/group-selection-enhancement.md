# Group Selection Enhancement

## Description

Enhance the lead and customer list panels in the marketing outreach section to require group selection before adding selected items to a group. Currently, selecting leads/customers directly adds them to a group without prompting for which group. Additionally, improve the groups panel to display detailed user information for each group, showing all users and their details per group.

## Core Logic

- In the lead and customer list panels, when users select items and attempt to add to a group, display a modal or dialog to select the target group from existing groups.
- Ensure the selection process is user-friendly, with proper validation and feedback using sonner toasts.
- In the groups panel, for each group, display a list of associated users (leads/customers) with their full details (name, phone, email, status, etc.).
- Maintain Persian RTL layout and responsiveness.

## Relations to Code Files

- `src/components/admin/outreach/lead-preview-table.tsx`: Modify selection and add-to-group logic.
- `src/components/admin/outreach/customers-table.tsx` (if exists): Similar modifications for customers.
- `src/app/admin/outreach/groups/page.tsx`: Update to display user details per group.
- `src/db/queries/groups.ts`: Ensure queries support fetching users per group.
- `src/app/admin/outreach/actions.ts`: Add server actions for group selection and assignment.

## Steps

1. Review existing lead and customer table components for current add-to-group functionality.
2. Create or modify a group selection dialog component.
3. Update lead-preview-table.tsx to trigger group selection dialog instead of direct addition.
4. Update customers table component similarly.
5. Modify groups page to fetch and display user details for each group.
6. Test integration and ensure proper error handling.

## Tasklist

- [ ] Review current add-to-group implementation in lead and customer panels
- [ ] Create group selection dialog component
- [ ] Update lead-preview-table.tsx for group selection prompt
- [ ] Update customers table for group selection prompt
- [ ] Enhance groups panel to show user details per group
- [ ] Test functionality and add error handling
