# Mobile Responsiveness Enhancement

## Overview

Enhance the BIM760 website to be fully mobile-friendly. This includes converting the sidebar to a hamburger sheet menu on mobile devices and ensuring all pages and components are responsive using Tailwind CSS.

## Core Logic

- Utilize Tailwind CSS responsive utilities (sm:, md:, lg:, xl:) for adaptive layouts.
- Convert the admin sidebar to a hamburger menu using shadcn/ui Sheet component on mobile screens.
- Ensure all pages and components use responsive design patterns: flexible grids, proper breakpoints, touch-friendly elements.
- Maintain Persian RTL layout on mobile.
- Prioritize mobile-first design where appropriate.

## Relations to Code Files

- Layout files: `src/app/layout.tsx`, `src/app/admin/layout.tsx`
- Sidebar component: `src/components/admin/sidebar.tsx`
- Page files: All routes in `src/app/` directory
- UI components: `src/components/ui/` directory
- Admin components: `src/components/admin/` directory

## Steps

1. Create comprehensive list of all pages in the application.
2. Create list of shared components (sidebar, headers, etc.) that appear above pages.
3. Modify sidebar component to use hamburger sheet menu on mobile.
4. Review and update each page for mobile responsiveness.
5. Review and update shared components for mobile responsiveness.
6. Perform final mobile responsiveness audit.

## List of Pages

- Home/Landing: `src/app/page.tsx`
- Admin Dashboard: `src/app/admin/page.tsx`
- Activity History: `src/app/admin/activity-history/page.tsx`
- Customers List: `src/app/admin/outreach/customers/page.tsx`
- Customer Detail: `src/app/admin/outreach/customers/[id]/page.tsx`
- Groups List: `src/app/admin/outreach/groups/page.tsx`
- Leads List: `src/app/admin/outreach/leads/page.tsx`
- Messages Panel: `src/app/admin/outreach/messages/page.tsx`
- Products Management: `src/app/admin/products/page.tsx`
- Templates Management: `src/app/admin/templates/page.tsx`
- Upload Leads: `src/app/admin/upload-leads/page.tsx`
- User Details: `src/app/admin/user-details/page.tsx`
- Sign In: `src/app/auth/signin/page.tsx`
- Customer Profile: `src/app/customer/profile/page.tsx`
- Settings: `src/app/settings/page.tsx`

## List of Shared Components

- Admin Sidebar: `src/components/admin/sidebar.tsx` (used in admin layout)

## Checklist

- [x] Create list of all pages
- [x] Create list of shared components
- [x] Modify sidebar for mobile hamburger menu
- [x] Update all pages for mobile responsiveness
- [x] Update all shared components for mobile responsiveness
- [x] Final mobile audit and testing
