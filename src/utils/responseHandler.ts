import { Response } from 'express';
import { SuccessResponse, ErrorResponse } from '../types/response';

/**
 * Sends a standardized success API response.
 * @param res The Express response object.
 * @param statusCode The HTTP status code (e.g., 200, 201).
 * @param message An optional success message.
 * @param data An optional data payload.
 * @param pagination An optional pagination object.
 */
export const sendSuccessResponse = <T = unknown>(
  res: Response,
  statusCode: number,
  message?: string,
  data?: T,
  pagination?: SuccessResponse<T>['pagination']
): void => {
  const responseBody: SuccessResponse<T> = { success: true };
  if (message) responseBody.message = message;
  if (data !== undefined) responseBody.data = data;
  if (pagination) responseBody.pagination = pagination;

  res.status(statusCode).json(responseBody);
};

/**
 * Sends a standardized error API response.
 * @param res The Express response object.
 * @param statusCode The HTTP status code (e.g., 400, 404, 500).
 * @param message The error message.
 * @param code An optional custom error code.
 * @param details Optional detailed error information (e.g., validation errors).
 * @param stack Optional stack trace (e.g., in development).
 */
export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  code?: string,
  details?: unknown,
  stack?: string
): void => {
  const responseBody: ErrorResponse = { success: false, message };
  if (code) responseBody.code = code;
  if (details !== undefined) responseBody.details = details;
  if (stack) responseBody.stack = stack;

  res.status(statusCode).json(responseBody);
};
