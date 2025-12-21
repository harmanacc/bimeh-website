# Fix Dashboard Date Error

## Description

The admin dashboard API is failing with a TypeError because Date objects are being passed directly to SQL queries in the dashboard metrics function. The error occurs when executing queries with date filters for today's data.

## Core Logic

Convert Date objects to ISO strings when using them in SQL template literals. Ensure date comparisons work correctly with UTC timezone handling.

## Relations to Code Files

- `src/db/queries/dashboard.ts`: Contains the getDashboardMetrics function with faulty date handling
- `src/app/api/admin/dashboard/route.ts`: Calls the getDashboardMetrics function

## Steps

1. Modify the date handling in getDashboardMetrics to convert Date objects to ISO strings for SQL templates
2. Ensure timezone is handled correctly (use UTC)
3. Test the dashboard loads without errors

## Tasklist

- [x] Update date conversions in dashboard queries
- [ ] Verify dashboard API works
