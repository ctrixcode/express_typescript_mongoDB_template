export const success = {
  FETCHED: (resource: string) => `Successfully fetched ${resource}.`,
  CREATED: (resource: string) => `Successfully created ${resource}.`,
  UPDATED: (resource: string) => `Successfully updated ${resource}.`,
  DELETED: (resource: string) => `Successfully deleted ${resource}.`,
};

export const error = {
  NOT_FOUND: (resource: string) => `${resource} not found.`,
  INVALID_ID: (resource: string) => `Invalid ${resource} ID provided.`,
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred on the server.',
  BAD_REQUEST: 'The request was invalid.',
  UNAUTHORIZED: 'Authentication failed. Please log in.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  AUTH: {
    EXPIRED_TOKEN: 'Your session has expired. Please log in again.',
    INVALID_TOKEN: 'Invalid token. Please log in again.',
  },
};

export const validation = {
  IS_REQUIRED: (field: string) => `${field} is required.`,
  IS_STRING: (field: string) => `${field} must be a string.`,
  IS_NUMBER: (field: string) => `${field} must be a number.`,
  IS_EMAIL: 'Please provide a valid email address.',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long.',
};
