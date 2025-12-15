## Marketing Outreach Panel: WhatsApp Personalized Message Tool with CRM Features

Build a full-stack web application for a marketing team to manage leads/customers, import data from Excel, generate personalized WhatsApp messages (using AI), preview/edit them per user, and send via WhatsApp Web. Include basic CRM features like activity history tracking, search, and export.

### Tech Stack

- **Framework**: Next.js 15 (App Router) with React 19.
- **UI**: Tailwind CSS + Shadcn/UI components for a clean, professional dashboard (use RTL support for Persian text).
- **Database**: PostgreSQL managed with Drizzle ORM (schema migrations via drizzle-kit).
- **AI Integration**: Use OpenRouter API (or Groq/OpenAI fallback) with a model like Google Gemini or Llama for generating personalized Persian messages.
- **Excel Handling**: Use SheetJS (xlsx) for parsing/uploads on the server-side (in API routes).
- **Authentication**: Simple admin-only access (e.g., NextAuth or clerk for email/password; assume single/multiple admins).
- **Other**: Zod for validation, React Hook Form for forms, Tanstack Table for tables.

### Database Schema (Using Drizzle ORM)

Define tables in `src/db/schema.ts`:

- **leads** (initial imported users): id (serial PK), firstName (text), lastName (text), phone (text, unique), insuranceType (text, optional), importedAt (timestamp), other custom fields as needed.
- **customers** (converted after outreach): id (serial PK), leadId (foreign key to leads, optional), firstName, lastName, phone (unique), etc. (copy from leads).
- **activities** (history): id (serial PK), customerId (FK to customers), messageText (text), isAiGenerated (boolean), sentAt (timestamp), sentBy (text, admin name), status (enum: 'sent', 'failed', etc.), notes (text optional).

Relations: One customer has many activities.

### Core Features

1. **Admin Dashboard Layout**

   - Sidebar with: Upload Leads, Leads Table, Customers Table, Activity History, Export Data.
   - All text in Persian (RTL layout).

2. **Excel Import (Admin Only)**

   - Upload page: File input for Excel (.xlsx) with columns like: نام, نام خانوادگی, شماره, نوع بیمه.
   - Parse on server (API route), normalize phone numbers (e.g., 0912... → 98912..., remove spaces/dashes).
   - Validate: Unique phones, valid Iranian formats.
   - Insert into `leads` table.
   - Show success/errors, progress bar.

3. **Leads/Customers Management**

   - Tabbed view: Leads (imported but not outreached) and Customers (after sending message).
   - Paginated table (Tanstack) with columns: Name, Full Name, Phone, Insurance Type, Actions.
   - Search bar: Text search by phone or name (full-text search in Postgres if possible).
   - After sending a message to a lead, automatically create a customer record and link activity.

4. **Message Generation & Sending Panel**

   - Main page: Editable global message template (large textarea) with placeholders like {نام}, {نام خانوادگی}, {نوع بیمه}.
   - Pre-fill with a professional insurance outreach template in Persian (e.g., greeting, offer, call to action, contact info).
   - Optional "Additional AI Instructions" textarea: User can add extra prompt (e.g., "Make it more urgent" or "Focus on family protection").

   **Per-User Message Flow (Key Feature):**

   - Table of all leads/customers.
   - For each row:
     - Show the **complete template** (global one) at the top (read-only preview).
     - Below: Two radio options:
       1. "Use Standard Template" → Auto-filled textarea with template + placeholders replaced by user's data (e.g., "سلام {نام} ...").
       2. "Customize with AI" → Separate textarea + "Generate" button. When clicked, call AI API with: global template + user data + additional instructions → Generate personalized message, fill textarea.
     - Both textareas are fully editable.
     - Live preview above the "Send" button: Shows exactly what will be sent (replaced placeholders or AI version).
     - "Send to WhatsApp" button → Opens modal:
       - Modal title: "Confirm Send"
       - Show full preview message.
       - Phone number.
       - Buttons: Cancel / Continue → Opens WhatsApp Web link: `https://wa.me/{normalizedPhone}?text={encodedMessage}`
     - After send (user confirms they sent manually), log activity: Create/update customer, add activity record (message, isAiGenerated, timestamp, etc.).
     - Rate limiting: Optional delay between sends.

5. **Activity History**

   - Separate table: All activities across customers.
   - Columns: Customer Name/Phone, Message Snippet, AI Generated?, Sent At, Sent By.
   - Filter by customer.

6. **Export Features (Admin Only)**
   - Buttons:
     - Export all leads.
     - Export all customers.
     - Export full history (customers + activities).
     - Export single/multiple selected customers' history (with checkbox selection).
   - Export as Excel (.xlsx) using SheetJS on server.

### Additional Requirements

- **RTL & Persian Support**: Full right-to-left layout, Persian fonts, correct text alignment.
- **Phone Normalization**: Always store/format as international (98...).
- **Error Handling**: Toasts/notifications for failures (e.g., AI errors, duplicate phones).
- **Rate Limiting**: 10-20s delay on AI calls if needed.
- **Security**: Protect API routes, validate inputs.
- **Responsive**: Works on desktop/mobile.
- **No Official WhatsApp API**: Use WhatsApp Web links only (manual send by user).
- **AI Prompt Structure**: System prompt: "Generate a personalized insurance outreach message in Persian, friendly and professional, using this template: [template]. For user: [user data]. Additional: [instructions]."

### Implementation Steps for You (AI Agent)

1. Set up Next.js project with Tailwind, Shadcn, Drizzle.
2. Configure Postgres connection (use env vars).
3. Define schema, migrations.
4. Build auth (simple).
5. Implement import page.
6. Build dashboard with tables.
7. Implement message panel with radio, textareas, AI generation (server action for API call).
8. Add modal, WhatsApp link, activity logging.
9. Add export routes.
10. Polish UI/UX.

Provide full code structure, key files, and explanations.
