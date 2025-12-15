## Home Landing Page

### Description

Create a minimal landing page with full-screen hero section, brief text, and login button. Implement sign-in page with email/password form using NextAuth.

### Core Logic

- Home page: Full-screen hero, minimal insurance text, login button redirects to /auth/signin.
- Sign-in page: Form with email/password, uses NextAuth signIn, redirects on success.
- Use shadcn/ui components for form.
- Responsive design.

### Relations to Code Files

- `src/app/page.tsx`: Update home page.
- `src/app/auth/signin/page.tsx`: New sign-in page.
- `src/lib/auth.ts`: NextAuth config.

### Steps

1. Update home page with hero layout and login button.
2. Create sign-in page with form.
3. Implement sign-in logic with NextAuth.

### Tasklist

- [x] Update home page layout
- [x] Create sign-in page
- [x] Implement authentication form
