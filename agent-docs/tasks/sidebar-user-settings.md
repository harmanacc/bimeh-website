# Sidebar User Settings

## Description

Add a settings tab and a user section at the bottom of the admin dashboard sidebar. The settings tab redirects to /settings (placeholder for now). The user section includes an avatar with a rounded person icon and the display name, linking to a user details page that varies based on the user's role.

## Core Logic

- Modify `src/components/admin/sidebar.tsx` to include new navigation items at the bottom.
- Use shadcn/ui Avatar component for the user section.
- Implement routing using Next.js Link component.
- Retrieve user information from the auth session (display name, role).
- User details page path should be dynamic based on role (e.g., /admin/users/[id] or similar, to be determined).
- Ensure RTL support for Persian text.

## Relations to Code Files

- `src/components/admin/sidebar.tsx`: Main sidebar component to modify.
- `src/app/admin/layout.tsx`: Admin layout that includes the sidebar.
- `lib/auth.ts`: Authentication utilities for getting user session.
- `types/next-auth.d.ts`: TypeScript types for auth session.
- `src/components/ui/avatar.tsx`: Avatar component from shadcn/ui.

## Steps

1. Review current sidebar structure and auth setup.
2. Add settings navigation item at bottom of sidebar.
3. Add user section with avatar and display name below settings.
4. Implement routing for settings (/settings) and user details (role-based).
5. Ensure proper styling and RTL layout.

## Tasklist

- [x] Review sidebar.tsx and auth setup
- [x] Add settings tab to sidebar
- [x] Add user section with avatar and display name
- [x] Implement routing for settings and user details
- [x] Test layout and functionality
