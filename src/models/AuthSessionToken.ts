import { Schema, model, Document, Types } from 'mongoose';

export interface IAuthSessionToken extends Document {
  userId: Types.ObjectId;
  jti: string;
  expiresAt: Date;
  isUsed: boolean;
  userAgent: string;
}

const AuthSessionTokenSchema = new Schema<IAuthSessionToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      // ref: 'User', // Add this reference once you have a User model
    },
    jti: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    userAgent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Create an index on expiresAt for automatic cleanup by MongoDB's TTL feature
// This will automatically delete documents after they expire.
AuthSessionTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AuthSessionTokenModel = model<IAuthSessionToken>(
  'AuthSessionToken',
  AuthSessionTokenSchema
);

export default AuthSessionTokenModel;
