/**
 * Formats a date string to DD/MM/YYYY format
 * @param {string|Date} dateString - The date to format
 * @returns {string} The formatted date string
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  // Use a consistent date format that doesn't depend on locale
  return date.toISOString().split("T")[0].split("-").reverse().join("/");
}
