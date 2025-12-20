// src/lib/template-utils.ts
// Utility functions for message template variable replacement

import type { Customer, Lead } from "@/db/schema";

/**
 * Supported fields for template replacement
 * Maps template variables to database field names
 */
export const SUPPORTED_TEMPLATE_FIELDS = {
  firstName: "firstName",
  lastName: "lastName",
  phone: "phone",
  nationalId: "nationalId",
  birthCertificateNumber: "birthCertificateNumber",
  birthCertificateIssuancePlace: "birthCertificateIssuancePlace",
  placeOfBirth: "placeOfBirth",
  dateOfBirth: "dateOfBirth",
  telegramId: "telegramId",
  whatsappId: "whatsappId",
  eitaId: "eitaId",
  baleId: "baleId",
  email: "email",
  gender: "gender",
  maritalStatus: "maritalStatus",
  numberOfChildren: "numberOfChildren",
  militaryServiceStatus: "militaryServiceStatus",
  occupation: "occupation",
  landlinePhone: "landlinePhone",
  emergencyPhone: "emergencyPhone",
  emergencyPhoneRelation: "emergencyPhoneRelation",
  residentialAddress: "residentialAddress",
  workAddress: "workAddress",
  residentialPostalCode: "residentialPostalCode",
} as const;

export type TemplateField = keyof typeof SUPPORTED_TEMPLATE_FIELDS;

/**
 * Type for records that can be used in template replacement
 */
type TemplateRecord = Partial<Customer | Lead>;

/**
 * Replaces {{fieldName}} placeholders in template text with actual values from record
 * @param template - Template text with {{fieldName}} placeholders
 * @param record - Customer or Lead record containing field values
 * @returns Processed template with variables replaced
 */
export function replaceTemplateVariables(
  template: string,
  record: TemplateRecord | null | undefined
): string {
  if (!record) return template;

  let result = template;

  // Replace each supported field
  Object.entries(SUPPORTED_TEMPLATE_FIELDS).forEach(
    ([templateKey, fieldName]) => {
      const placeholder = `{{${templateKey}}}`;
      const value = record[fieldName as keyof TemplateRecord];

      // Replace with value if exists, otherwise leave placeholder or replace with empty string
      if (value !== null && value !== undefined && value !== "") {
        // Format date fields if needed
        if (fieldName === "dateOfBirth" && value instanceof Date) {
          const formattedDate = value.toLocaleDateString("fa-IR");
          result = result.replace(new RegExp(placeholder, "g"), formattedDate);
        } else {
          result = result.replace(new RegExp(placeholder, "g"), String(value));
        }
      } else {
        // Replace with empty string for missing fields
        result = result.replace(new RegExp(placeholder, "g"), "");
      }
    }
  );

  return result;
}

/**
 * Gets a list of missing fields in a template for a given record
 * @param template - Template text
 * @param record - Customer or Lead record
 * @returns Array of missing field names
 */
export function getMissingTemplateFields(
  template: string,
  record: TemplateRecord | null | undefined
): TemplateField[] {
  if (!record) return [];

  const missingFields: TemplateField[] = [];

  Object.entries(SUPPORTED_TEMPLATE_FIELDS).forEach(
    ([templateKey, fieldName]) => {
      const placeholder = `{{${templateKey}}}`;
      if (template.includes(placeholder)) {
        const value = record[fieldName as keyof TemplateRecord];
        if (value === null || value === undefined || value === "") {
          missingFields.push(templateKey as TemplateField);
        }
      }
    }
  );

  return missingFields;
}

/**
 * Validates if a template has any variables
 * @param template - Template text
 * @returns True if template contains variables
 */
export function templateHasVariables(template: string): boolean {
  return /\{\{[a-zA-Z]+\}\}/.test(template);
}
