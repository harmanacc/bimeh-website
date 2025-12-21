# Activity History Panel

## Overview

This task implements a comprehensive activity history panel for the admin customer detail page, displaying a complete log of all outreach activities (WhatsApp, SMS, email, Telegram, etc.) sent to or received from customers. The panel provides detailed tracking of communication attempts, success/failure status, and message metadata.

## Core Logic

- **Activity Tracking**: Display all outreach activities with timestamps, status, and platform information
- **Status Visualization**: Color-coded status indicators (sent, failed, pending) with appropriate icons
- **Message Details**: Show full message content, templates used, AI generation indicators, and failure reasons
- **Platform Support**: Support for multiple communication channels (WhatsApp, SMS, email, Telegram, Bale, Eita, Instagram)
- **User Experience**: Scrollable interface, real-time refresh, and responsive design
- **RTL Support**: Full Persian RTL layout support for the Iranian market

## Relations to Code Files

- **Database**: `src/db/queries/activities.ts` - Query functions for activity data
- **Component**: `src/components/admin/outreach/activity-history-panel.tsx` - React component with UI
- **Integration**: `src/app/admin/outreach/customers/[id]/page.tsx` - Integrated into customer detail page

## Steps

1. **Create Activity History Component** (`src/components/admin/outreach/activity-history-panel.tsx`)

   - Build a card-based interface with scrollable activity list
   - Implement status indicators with appropriate icons and colors
   - Display channel labels with Persian translations
   - Show message content with proper formatting and wrapping
   - Include metadata like template usage, AI generation, and failure reasons
   - Add refresh functionality with toast notifications
   - Implement responsive design with proper overflow handling

2. **Integrate into Customer Detail Page** (`src/app/admin/outreach/customers/[id]/page.tsx`)

   - Import the new ActivityHistoryPanel component
   - Add the component to the customer detail page layout alongside the notes panel
   - Position both panels in a responsive grid layout
   - Pass the customer ID as a prop

3. **Ensure Data Consistency**
   - Verify that the activities API endpoint supports customer filtering
   - Ensure proper date formatting for Persian locale
   - Validate that all activity types and statuses are properly handled

## Tasklist

- [ ] Create the ActivityHistoryPanel React component
- [ ] Implement status indicators with appropriate styling and icons
- [ ] Add channel labels with Persian translations
- [ ] Display message content with proper formatting
- [ ] Include metadata display (templates, AI generation, failure reasons)
- [ ] Add refresh functionality with user feedback
- [ ] Ensure responsive design and proper scrolling
- [ ] Integrate the component into the customer detail page
- [ ] Test with various activity types and statuses
- [ ] Verify RTL layout and Persian text display
