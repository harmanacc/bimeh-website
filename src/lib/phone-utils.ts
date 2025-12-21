/**
 * Phone number utilities for BIM760 application
 * Handles normalization and formatting for Iranian phone numbers
 */

/**
 * Normalizes phone number to local format (09xxxxxxxxx)
 * Converts international format (+989xxxxxxxxx) to local format
 * @param phone - Phone number string
 * @returns Normalized phone number in 09 format
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return phone;

  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+98")) {
    // International format: +989xxxxxxxxx -> 09xxxxxxxxx
    const withoutCountry = cleaned.slice(3); // Remove +98
    return "0" + withoutCountry;
  } else if (cleaned.startsWith("98")) {
    // Without + but with country code: 989xxxxxxxxx -> 09xxxxxxxxx
    const withoutCountry = cleaned.slice(2); // Remove 98
    return "0" + withoutCountry;
  } else if (cleaned.startsWith("9") && cleaned.length === 10) {
    // Mobile without 0: 9xxxxxxxxx -> 09xxxxxxxxx
    return "0" + cleaned;
  } else if (cleaned.startsWith("09")) {
    // Already in local format
    return cleaned;
  }

  // Return as-is if doesn't match patterns
  return cleaned;
}

/**
 * Converts local phone number format to international format for WhatsApp
 * @param phone - Phone number in 09 format
 * @returns Phone number in +989 format
 */
export function toWhatsAppFormat(phone: string): string {
  if (!phone) return phone;

  const normalized = normalizePhoneNumber(phone);

  if (normalized.startsWith("09")) {
    // 09xxxxxxxxx -> +989xxxxxxxxx
    return "+98" + normalized.slice(1);
  }

  // If not in expected format, return normalized
  return normalized;
}

/**
 * Checks if phone number is in valid local format (09xxxxxxxxx)
 * @param phone - Phone number string
 * @returns True if valid local format
 */
export function isValidLocalFormat(phone: string): boolean {
  const normalized = normalizePhoneNumber(phone);
  return /^09\d{9}$/.test(normalized);
}
