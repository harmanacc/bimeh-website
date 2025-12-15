# initial note

this file is the general system prompt for the agent and how the agent should behave and what are the rules of the agent .
it is not part of a task nor a file to be edited by the agent . you are to follow the rules of the agent .

# Welcome to BIM760

BIM760 is a customer/admin web application for an insurance company, built with Next.js 16 (App Router). It includes SEO-optimized product detail pages (PDPs) for insurance products, user accounts, reminders, chatbots, a marketing outreach panel with AI-powered WhatsApp messaging, and a comprehensive admin panel for managing content, leads, customers, campaigns, queues (e.g., SMS/WhatsApp), activity history, and AI-suggested responses.

## Getting Started

BIM760 is a full-stack Next.js 16 application using Drizzle ORM, PostgreSQL, Zustand for state management, Tailwind CSS, and shadcn/ui components , lucide-react icons.

To get started, follow these steps:

1. To start doing any task, you must first create a task Markdown file describing what you intend to do, including proper relations to existing code files (without writing actual code in the task file).
   The task file should be minimal and focused: core logic, key steps, and a checklist.
   Example task header sections:

   - Overview
   - Core Logic
   - Relations to Code Files
   - Steps
   - Checklist

2. Share the task with me and wait for confirmation before proceeding.
3. Execute the task step by step.
4. Update the checklist as items are completed and confirm with me when the task is fully done.
5. I will test the implementation myself on the running server. Do not run the server, build the project, or execute npm commands yourself.
6. Never attempt to start or build the application locally.

Always begin by reviewing `package.json` and the root `README.md` to understand current dependencies, scripts, and project conventions. Follow existing patterns strictly.

## How to Create New Files

- Files must be small, focused, and serve a single responsibility. If a file grows large or handles multiple unrelated concerns, split it into smaller files.
- Main structure:
  - Pages and layouts: `/app`
  - Components: `/components`
  - Database logic and schema: `/db`
  - Content (e.g., MDX for PDPs): `/content`
  - API routes and server actions: `/app/api` or server-only files
  - Utilities and helpers: `/lib` or `/utils` (prefer colocated utils next to the feature folder when possible)

Every major folder must contain a concise `README.md` explaining its purpose, key files, and usage guidelines. When creating a new folder, add a minimal `README.md` immediately — no code references, no bloat, just high-level intent.

## Important Rules

- Do not mock data, functions, components, or APIs. Always implement real logic using existing utilities or create proper ones.
- Never use `any` or `unknown` types unless absolutely unavoidable — in such rare cases, add a clear comment explaining why.
- All text in the admin/marketing panels must support Persian (RTL layout). Use proper RTL classes and direction handling.
- Phone numbers must always be normalized to international format (e.g., 98912...) before storage or use in WhatsApp links.

## Folder and Architecture Logic

- Database operations must be isolated in dedicated files under `/db` (e.g., `/db/queries/leads.ts`, `/db/actions/customers.ts`, or centralized in `/db/index.ts`). Never place raw Drizzle queries inside components, pages, or client code.
- Helper and utility functions belong in `/lib` or feature-specific `/utils` folders. Check existing utilities first before creating new ones.
- For content-heavy pages (PDPs), use MDX in `/content` processed via Contentlayer or similar.
- Marketing/CRM features (leads import, message templates, AI personalization, activity logging, exports) should follow clean separation: UI in `/components/admin/outreach`, server actions in `/app/admin/outreach/actions`, queries in `/db/queries/outreach.ts`.

## Agentic Flow

Before any implementation:

1. Review `package.json` and relevant folder `README.md` files.
2. Ensure every major folder has an up-to-date `README.md`. Create one if missing.
3. Create a task file in `agent-docs/tasks/` named after the feature (kebab-case).
   Sections required:
   - **Description**: Brief overview 1 or 2 paragraphs.
   - **core Logic**: specific details to pay attention to.
   - **Relations to Code Files**: Links to relevant files.
   - **Steps**: Sequential implementation steps with file references
   - **Tasklist**: Markdown checklist (`[]` / `[x]`)
4. Avoid assumptions. Ask for clarification if code behavior or requirements are unclear. you have access to context7 mcp . use it heavily to get the latest implementation details and documentations.
5. Leverage Next.js 16 features appropriately (server actions, streaming, caching, Turbopack).

## Important Notes

1. Always reuse existing components, hooks, utilities, Tailwind classes, and color tokens.
2. Do not run the server or execute build/dev commands — I will handle testing.
3. Ensure full responsiveness (mobile and desktop).
4. Prioritize SEO best practices, especially for public-facing pages (SSG where possible, proper meta tags, structured data).
5. For all insurance-related data and marketing outreach:
   - Use server-side rendering or server actions for sensitive operations
   - Follow basic security practices (input validation, no client-side secrets)
   - Log activities securely
     6- the contents of the website should always be persian.
     7- use `sonner` for toasts. for every operation .

## Coding Practices

1. One component per file, named clearly.
2. Use exclusively shadcn/ui components, Tailwind CSS, and lucide-react icons.
3. Define TypeScript interfaces/types in separate files close to their usage (e.g., `/types/outreach.ts`).
4. Use Drizzle ORM exclusively for database work. Schema in `/db/schema.ts`.
5. File and folder names must be kebab-case.
6. Implement proper error handling and user feedback (toasts, loading states).

## Communication Protocol

- Be direct, technical, and concise
- No conversational fillers ("Great", "Sounds good", etc.)
- Complete tasks sequentially and wait for confirmation at key milestones
- Ask questions when making big decisions or unclear.
- Reference exact file paths and context when discussing changes

## Task Completion Criteria

- All items in the task checklist marked `[x]`
- Code integrates cleanly with existing structure
- No TypeScript errors
- Functionality works as described (verified by my testing)
- All conventions, folder rules, and security considerations followed

The goal is to build a robust, maintainable, and scalable insurance platform with strong marketing/CRM capabilities while keeping code clean, typed, and consistent.
Always update your task checklist as progress is made.
