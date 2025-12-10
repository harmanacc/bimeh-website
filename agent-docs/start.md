# initial note

this file is the general system prompt for the agent and how the agent should behave and what are the rules of the agent .
it is not part of a task nor a file to be edited by the agent . you are to follow the rules of the agent .

# Welcome to BIM760

BIM760 is a customer/admin web application for an insurance company, built with Next.js 16. It focuses on SEO-optimized product detail pages (PDPs) for insurance products, user accounts, reminders, chatbots, and an admin panel for managing content, queues (e.g., SMS campaigns), WhatsApp interfaces, and AI-suggested responses.

## Getting Started

BIM760 is a full-stack Next.js 16 with Drizzle ORM , PostgreSQL .Zustand ,Tailwind CSS, shadcn components .

To get started, follow these steps:

1. To start doing any task, you need to make a task of what you want to do. and make the proper relations to code files (without explicitly writing the code in the task file).
   The task file should be bare minimum, just the core logics, the steps of the task and a checklist of steps to do which after the task is done gets checked.
   Example of task header sections:

   - Overview
   - Core Logic
   - Relations to Code Files
   - Steps
   - Checklist

2. Check the task with me and confirm.
3. Start doing the task.
4. Check the task list and confirm with me that the task is done.
5. I will test it myself and confirm that it is done, do not run the server yourself as it is running on my server and I will test it myself.
6. Do not build the project.

To get started, always read `package.json` and the `README.md` file to understand the project. Try to follow the conventions of the project. Do not create test files. Ask me to test if you need to. Do not attempt to run the server yourself.

## How to create new files

When you want to create a new file, the files should be bite-sized and have one or few logics. A file should have one purpose only and if you are getting big in the file should be broken into smaller files.

The main app is under the root Next.js structure: pages in `/app`, components in `/components`, database in `/db`, content (e.g., MDX for PDPs) in `/content`. API routes in `/app/api` for backend logic.

# important note

Under each chunk of code, big folders have a `README.md` file that explains the purpose of the folder and the files inside it, and how to use or create them. Also if you make a new folder there should be a `README.md` file that explains the purpose of the folder and how to use it, super minimal and easy to understand . not refrencing code or bloat .

# important note

Do not mock anything. Do not mock data, functions, or anything else. Do not use type 'any' or 'unknown' in the code unless absolutely necessary and provide the explanation why it is necessary.

## important folder logics

DB operations should be separate functions in `/db/index.ts` or specific query files (e.g., `/db/queries/products.ts`). Do not add DB operations inside components or pages; the logic should be in the DB operations files, and you will call those functions.

Helper functions should be inside a `/lib` or `/utils` folder next to the parent folder. They should already exist so check first. If not, create a new one. And helper files should be named after the logic. If the logics are far separated, create a new folder for them.

For content-heavy PDPs, use MDX in `/content` with Contentlayer for processing.

## Agentic Flow

Before making any decisions, follow the agentic flow guidelines:

1. Always review `package.json` .
2. Ensure every major folder has a `README.md` file explaining the purpose of the folder and its contents at a high level. If a `README.md` is missing, create one with a general overview.
3. Before starting any task, create a task Markdown file named after the feature in the `agent-docs/tasks` folder with the following sections:
   - **Description**: A brief overview of the task.
   - **Steps**: Key steps taken to complete the task, including references to relevant files.
   - **Tasklist**: A checklist using `[]` for tasks. Mark completed items with `[x]`.
4. Avoid making assumptions about the code. If uncertain, seek clarification from me.
5. Be mindful of Next.js 16 features like Cache Components, Turbopack, and proxy.ts for optimal performance.

## Important Notes

1. Always utilize the project's existing utilities, functions, hooks, components, Tailwind classes, and colors.
2. Do not try to run the server, I will run the server and test the changes myself. Do not build or anything else.
3. Always be mindful of responsiveness, for both mobile and desktop.
4. This is a content-heavy project so make sure every best practice of a SEO-friendly website is followed (e.g., SSG for PDPs, meta tags, structured data). You may suggest improvements for SEO to be added or done by me.
5. For insurance data, prioritize security: Use server-side rendering/actions for sensitive ops, encrypt where needed, and follow OWASP basics.

## Coding Practices

1. Each component should be in a separate file.
2. Always use shadcn/ui and Tailwind classes for UI elements, lucide-react for icons.
3. Do not use the `any` type, use the specific type as much as possible.
4. Types should be in a separate file in the closest folder to the component.
5. Use Drizzle for all DB interactions; define schemas in `/db/schema.ts`.
6. Leverage Next.js 16 features: Use Cache Components for explicit caching in dynamic parts, Turbopack for dev/build speed.
   Markdown
7. always use kebab-case for filenames and folders.

## Communication Protocol

- Be direct and technical in responses
- Don't use conversational fillers like "Great", "Sure", etc.
- Complete tasks step-by-step, waiting for confirmation between steps
- Ask for clarification only when absolutely necessary
- Reference specific files and lines when discussing code

## Task Completion Criteria

- All checklist items in the task MD file must be checked
- Code must compile without errors
- Basic functionality must work as specified
- Follow all architectural decisions from the MD files

The goal is to build a robust, scalable betting application that follows all specified rules and maintains clean, maintainable code.
Always update your task checklist as you complete each step.
