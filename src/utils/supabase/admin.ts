export const ADMIN_EMAIL = "adminjack1@gmail.com";

export function isAdminEmail(value: unknown): boolean {
  return typeof value === "string" && value.trim().toLowerCase() === ADMIN_EMAIL;
}
