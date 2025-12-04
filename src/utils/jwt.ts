import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Types } from 'mongoose';
import AuthSessionTokenModel from '../models/AuthSessionToken';
import { UnauthorizedError } from './ApiError';
import { error as errorMessages } from '../constants/messages';
import { logger } from './logger';
import { appConfig } from '../config';

export interface TokenPayload {
  userId: string;
  email: string;
  jti?: string; // Add jti as an optional property
}

/**
 * Generates an access token.
 * @param payload The data to include in the token.
 * @returns The generated access token string.
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: appConfig.jwt.accessTokenExpiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, appConfig.jwt.secret, options);
};

/**
 * Generates a refresh token and saves its metadata to the database.
 * @param payload The data to include in the token.
 * @param userAgent The user agent of the client.
 * @returns An object containing the refresh token string and its JTI.
 */
export const generateRefreshToken = (
  payload: TokenPayload,
  userAgent: string
): { refreshToken: string; jti: string } => {
  const jti = uuidv4();
  const options: SignOptions = {
    expiresIn: appConfig.jwt.refreshTokenExpiresIn as SignOptions['expiresIn'],
    jwtid: jti,
  };
  const refreshToken = jwt.sign(payload, appConfig.jwt.secret, options);

  // Calculate expiration date for database storage
  let expiresInSeconds: number;
  if (typeof appConfig.jwt.refreshTokenExpiresIn === 'string') {
    // A simple parser for formats like "7d", "59m", etc.
    const value = parseInt(
      appConfig.jwt.refreshTokenExpiresIn.slice(0, -1),
      10
    );
    const unit = appConfig.jwt.refreshTokenExpiresIn.slice(-1);
    switch (unit) {
      case 's':
        expiresInSeconds = value;
        break;
      case 'm':
        expiresInSeconds = value * 60;
        break;
      case 'h':
        expiresInSeconds = value * 60 * 60;
        break;
      case 'd':
        expiresInSeconds = value * 24 * 60 * 60;
        break;
      default:
        expiresInSeconds = 7 * 24 * 60 * 60; // Default to 7 days
    }
  } else {
    expiresInSeconds = appConfig.jwt.refreshTokenExpiresIn;
  }

  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

  // Save refresh token metadata to database
  const authSessionToken = new AuthSessionTokenModel({
    userId: new Types.ObjectId(payload.userId),
    jti: jti,
    expiresAt: expiresAt,
    isUsed: false,
    userAgent: userAgent,
  });

  authSessionToken.save().catch(err => {
    logger.error('Error saving AuthSessionToken:', err);
    // Non-blocking call: Don't prevent token generation even if DB save fails.
  });

  return { refreshToken, jti };
};

/**
 * Verifies a JWT token.
 * @param token The JWT token string to verify.
 * @returns The decoded payload if the token is valid.
 * @throws {UnauthorizedError} if the token is invalid or expired.
 */
export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, appConfig.jwt.secret) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError(errorMessages.AUTH.EXPIRED_TOKEN);
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError(errorMessages.AUTH.INVALID_TOKEN);
    }
    throw new UnauthorizedError(errorMessages.AUTH.INVALID_TOKEN);
  }
};

/**
 * Decodes a JWT token without verifying its signature.
 * @param token The JWT token string to decode.
 * @returns The decoded payload or null if decoding fails.
 */
export const decodeToken = (token: string): TokenPayload | null => {
  return jwt.decode(token) as TokenPayload | null;
};
