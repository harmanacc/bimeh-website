# Database Layer

Database operations and schema management for BIM760.

## Structure

- `schema.ts` - Drizzle ORM schema definitions (tables, enums, types)
- `queries/` - Pure query functions organized by domain
- `index.ts` - Database client initialization

## Usage

All database operations should be pure functions in the `queries/` folder. Import and use the `db` client from `index.ts`.

Example:

```typescript
import { db } from "@/db";
import { getProductBySlug } from "@/db/queries/products";

const product = await getProductBySlug("car-insurance");
```
