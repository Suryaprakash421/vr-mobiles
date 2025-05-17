/**
 * Safely creates a URL object that works in both client and server environments
 *
 * @param {string} url - The URL to parse
 * @param {string} [base] - Optional base URL
 * @returns {URL|null} - The URL object or null if creation fails
 */
export function createSafeUrl(url, base) {
  try {
    // Check if we're in a browser environment
    const isBrowser = typeof window !== "undefined";

    // If base is not provided, use window.location.origin in browser
    // or a placeholder in server environment
    if (!base && isBrowser) {
      base = window.location.origin;
    } else if (!base) {
      base = "http://localhost:3001";
    }

    // Ensure url is a string
    const urlString = url || "";

    // Create the URL object
    return new URL(urlString, base);
  } catch (error) {
    console.error("Error creating URL:", error);
    // Return a fallback URL instead of null
    try {
      return new URL("http://localhost:3001");
    } catch (e) {
      return null;
    }
  }
}

/**
 * Safely joins URL path segments
 *
 * @param {...string} segments - URL path segments to join
 * @returns {string} - The joined URL path
 */
export function joinUrlPaths(...segments) {
  return segments
    .map((segment) => segment.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");
}

/**
 * Creates a URL search params string that works in both client and server environments
 *
 * @param {Object} params - Key-value pairs for search parameters
 * @returns {string} - The search params string
 */
export function createSearchParams(params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const paramsString = searchParams.toString();
  return paramsString ? `?${paramsString}` : "";
}

/**
 * Gets the API base URL safely for both client and server environments
 *
 * @returns {string} - The API base URL
 */
export function getApiBaseUrl() {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== "undefined";

  // In browser, use window.location.origin
  if (isBrowser) {
    return window.location.origin;
  }

  // In server environment, use environment variable or default to a valid URL
  // This ensures we always have a valid URL during build time
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
}

/**
 * Creates a full API URL safely for both client and server environments
 *
 * @param {string} path - The API path (e.g., "/api/customers")
 * @param {Object} [params] - Optional query parameters
 * @returns {string} - The full API URL
 */
export function createApiUrl(path, params) {
  // Always get a valid base URL (getApiBaseUrl now always returns a valid URL)
  const baseUrl = getApiBaseUrl();
  const apiPath = path.startsWith("/") ? path : `/${path}`;
  const queryString = params ? createSearchParams(params) : "";

  // Ensure we have a valid URL by combining the base URL and path
  return `${baseUrl}${apiPath}${queryString}`;
}
