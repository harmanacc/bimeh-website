## Database Schema Updates for Statuses and Customer Fields

### Description

Add status fields to leads and customers tables. Add extensive customer data fields. Leads: 'lead', 'contacted'. Customers: 'contacted', 'target', 'active'. Ensure migration handles existing data.

### Core Logic

- Add status enums: leadStatusEnum ('lead', 'contacted'); customerStatusEnum ('contacted', 'target', 'active').
- Add status columns to leadsTable and customersTable.
- Add new fields to customersTable: nationalId, birthCertificateNumber, birthCertificateIssuancePlace, placeOfBirth, dateOfBirth, telegramId, whatsappId, eitaId, baleId, email, gender, maritalStatus, numberOfChildren, militaryServiceStatus, occupation, landlinePhone, emergencyPhone, emergencyPhoneRelation, residentialAddress, workAddress, residentialPostalCode, insuranceType.
- Update type exports.
- Create migration script.

### Relations to Code Files

- Schema: [`src/db/schema.ts`](src/db/schema.ts)
- Migration: New file in `drizzle/` directory

### Steps

1. Define status enums in schema.ts.
2. Add status columns to leads and customers tables.
3. Add new customer fields.
4. Update type exports.
5. Generate and run migration.

### Tasklist

- [x] Define status enums
- [x] Add status column to leadsTable
- [x] Add status column to customersTable
- [x] Add new customer data fields
- [x] Update type exports
- [x] Create and run migration
