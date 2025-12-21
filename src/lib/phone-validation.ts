import { z } from "zod";
import { normalizePhoneNumber } from "./phone-utils";

/**
 * Zod schema for validating phone numbers in local format (09xxxxxxxxx)
 */
export const phoneNumberSchema = z
  .string()
  .min(1, "Phone number is required")
  .transform((val) => normalizePhoneNumber(val))
  .refine((val) => /^09\d{9}$/.test(val), {
    message:
      "Phone number must be in format 09xxxxxxxxx (11 digits starting with 09)",
  });

/**
 * Zod schema for optional phone numbers
 */
export const optionalPhoneNumberSchema = z
  .string()
  .optional()
  .transform((val) => (val ? normalizePhoneNumber(val) : val))
  .refine((val) => !val || /^09\d{9}$/.test(val), {
    message:
      "Phone number must be in format 09xxxxxxxxx (11 digits starting with 09)",
  });

/**
 * Validates a phone number string
 * @param phone - Phone number to validate
 * @returns Validation result with normalized phone or error
 */
export function validatePhoneNumber(phone: string): {
  success: boolean;
  data?: string;
  error?: string;
} {
  const result = phoneNumberSchema.safeParse(phone);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return {
      success: false,
      error: result.error.issues[0]?.message || "Invalid phone number",
    };
  }
}
