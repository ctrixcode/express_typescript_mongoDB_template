import mongoose from 'mongoose';
import { IExample } from '../models/Example';
import {
  CreateExampleInput,
  UpdateExampleInput,
} from '../schemas/example.schema';

/**
 * Converts an IExample Mongoose document to a plain JavaScript object (DTO)
 * that is safe to send to the client.
 *
 * @param example The Mongoose document to convert.
 * @returns A plain JavaScript object representing the example.
 */
export const toExampleDto = (example: mongoose.HydratedDocument<IExample>) => {
  return {
    id: example._id!.toString(),
    name: example.name,
    description: example.description,
    tags: example.tags,
    price: example.price,
    metadata: {
      category: example.metadata.category,
      priority: example.metadata.priority,
      createdAt: example.metadata.createdAt,
    },
    createdAt: example.createdAt,
    updatedAt: example.updatedAt,
  };
};

/**
 * Maps the validated input for creating a new example to the format
 * expected by the Mongoose model.
 *
 * @param createExampleInput The validated input from the Zod schema.
 * @returns A partial IExample object ready to be saved to the database.
 */
export const toExample = (
  createExampleInput: CreateExampleInput
): Partial<IExample> => {
  return {
    name: createExampleInput.name,
    description: createExampleInput.description,
    tags: createExampleInput.tags,
    price: createExampleInput.price,
    metadata: {
      category: createExampleInput.metadata.category,
      priority: createExampleInput.metadata.priority || 'medium',
      createdAt: new Date(),
    },
  };
};

/**
 * The shape of the data required for updating an example using dot notation
 * for efficient nested object updates with Mongoose's $set operator.
 */
type ExampleUpdateData = {
  name?: string;
  description?: string;
  tags?: string[];
  price?: number;
  'metadata.category'?: 'electronics' | 'clothing' | 'books' | 'food' | 'other';
  'metadata.priority'?: 'low' | 'medium' | 'high';
};

/**
 * Maps the validated input for updating an example to a format that
 * Mongoose's $set operator can use efficiently, using dot notation for
 * nested fields.
 *
 * @param updateExampleInput The validated input from the Zod schema.
 * @returns An object with dot notation for updating nested fields.
 */
export const toExampleUpdate = (
  updateExampleInput: UpdateExampleInput
): ExampleUpdateData => {
  const updateData: ExampleUpdateData = {};

  if (updateExampleInput.name) {
    updateData.name = updateExampleInput.name;
  }
  if (updateExampleInput.description) {
    updateData.description = updateExampleInput.description;
  }
  if (updateExampleInput.tags) {
    updateData.tags = updateExampleInput.tags;
  }
  if (updateExampleInput.price) {
    updateData.price = updateExampleInput.price;
  }
  if (updateExampleInput.metadata?.category) {
    updateData['metadata.category'] = updateExampleInput.metadata.category;
  }
  if (updateExampleInput.metadata?.priority) {
    updateData['metadata.priority'] = updateExampleInput.metadata.priority;
  }

  return updateData;
};
