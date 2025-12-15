## Authentication System for Users

### Description

Implement a complete authentication system for BIM760, supporting super admin, admins, and customers. Super admin is configured via .env, can create admins. Users can manage their profiles (password, email, names). Passwords hashed, email/password auth now, extensible to OTP. No public signup.

### Core Logic

- Update users table: add passwordHash, firstName, lastName, displayName, phone (optional for OTP future).
- Update userRoleEnum: add 'super-admin'.
- Super admin seeded from .env on build.
- Auth via NextAuth.js with email/password.
- Server actions for login, profile updates.
- Middleware for route protection.
- Admin panel for super admin to create admins (no UI yet, server action).

### Relations to Code Files

- `src/db/schema.ts`: Update usersTable and enum.
- `src/lib/auth.ts`: NextAuth config.
- `src/app/api/auth/[...nextauth]/route.ts`: NextAuth API.
- `src/middleware.ts`: Route protection.
- `src/app/admin/auth/actions.ts`: Server actions for admin creation.
- `.env.example`: Add super admin vars.

### Steps

1. Update DB schema for users (password, names, phone, super-admin role).
2. Generate and apply migration.
3. Configure NextAuth with email/password provider.
4. Create auth utilities and middleware.
5. Implement server actions for profile management.
6. Add super admin seeding on build.
7. Create admin creation action (no UI).

### Tasklist

- [ ] Update usersTable schema with new fields
- [ ] Add super-admin to userRoleEnum
- [ ] Generate DB migration
- [ ] Configure NextAuth setup
- [ ] Implement auth middleware
- [ ] Create profile update actions
- [ ] Add super admin seeding
- [ ] Implement admin creation action
