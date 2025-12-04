import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils';
import ApiError, { NotFoundError } from '../utils/ApiError';
import { error as errorMessages } from '../constants/messages';

// 404 handler - using a specific error class
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new NotFoundError(`Route not found: ${req.originalUrl}`));
};

// Main error handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  // If the error is not an instance of ApiError, it's an unexpected server error.
  // We convert it to a generic ApiError to handle it gracefully.
  if (!(error instanceof ApiError)) {
    logger.error('UNHANDLED_ERROR', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
    error = new ApiError(
      errorMessages.INTERNAL_SERVER_ERROR,
      500,
      false // This is not an operational error
    );
  }

  const { statusCode, message, isOperational, stack } = error as ApiError;

  // For non-operational errors in production, we don't want to leak details.
  if (!isOperational && process.env.NODE_ENV === 'production') {
    res.status(500).json({
      status: 'error',
      message: errorMessages.INTERNAL_SERVER_ERROR,
    });
    return;
  }

  // Log operational errors for monitoring
  if (isOperational) {
    logger.warn('OPERATIONAL_ERROR', {
      message: message,
      path: req.path,
      method: req.method,
    });
  }

  const response: { status: string; message: string; stack?: string } = {
    status: 'error',
    message,
  };

  // Include stack trace in development for easier debugging
  if (process.env.NODE_ENV === 'development') {
    response.stack = stack;
  }

  res.status(statusCode).json(response);
};
