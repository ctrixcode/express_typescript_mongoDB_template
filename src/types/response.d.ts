/**
 * Interface for a standardized successful API response.
 * @template T The type of the data payload.
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  message?: string;
  data?: T;
  // Add any other common success properties here, e.g., pagination metadata
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Interface for a standardized error API response.
 */
export interface ErrorResponse {
  success: false;
  code?: string; // A custom error code (e.g., "AUTH_001", "VALIDATION_ERROR")
  message: string;
  details?: unknown; // More detailed error information, e.g., validation errors
  stack?: string; // Stack trace, typically only in development
}
