import mongoose from 'mongoose';
import { IExample } from '../models/Example';
import * as exampleRepository from '../repositories/example.repository';
import {
  CreateExampleInput,
  UpdateExampleInput,
} from '../schemas/example.schema';

/**
 * Create a new example item
 */
export const createExample = async (
  exampleData: CreateExampleInput
): Promise<mongoose.HydratedDocument<IExample>> => {
  return exampleRepository.create(exampleData);
};

/**
 * Get all example items with pagination and filtering
 */
export const getExamples = async (
  page: number = 1,
  limit: number = 10,
  category?: string,
  isDeleted?: boolean
): Promise<{
  examples: mongoose.HydratedDocument<IExample>[];
  total: number;
}> => {
  return exampleRepository.find(page, limit, category, isDeleted);
};

/**
 * Get example item by ID
 */
export const getExampleById = async (
  exampleId: string
): Promise<mongoose.HydratedDocument<IExample> | null> => {
  return exampleRepository.findById(exampleId);
};

/**
 * Update example item
 */
export const updateExample = async (
  exampleId: string,
  updateData: UpdateExampleInput
): Promise<mongoose.HydratedDocument<IExample> | null> => {
  return exampleRepository.update(exampleId, updateData);
};

/**
 * Delete example item (soft delete)
 */
export const deleteExample = async (exampleId: string): Promise<boolean> => {
  return exampleRepository.softDelete(exampleId);
};

/**
 * Get examples by category
 */
export const getExamplesByCategory = async (
  category: string
): Promise<mongoose.HydratedDocument<IExample>[]> => {
  return exampleRepository.findByCategory(category);
};

/**
 * Search examples by name or description
 */
export const searchExamples = async (
  searchTerm: string
): Promise<mongoose.HydratedDocument<IExample>[]> => {
  return exampleRepository.search(searchTerm);
};
