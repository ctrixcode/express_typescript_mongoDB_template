import mongoose from 'mongoose';
import Example, { IExample } from '../models/Example';
import { logger } from '../utils';
import { toExample, toExampleUpdate } from '../mappers/example.mapper';
import {
  CreateExampleInput,
  UpdateExampleInput,
} from '../schemas/example.schema';

export interface ExampleFilter {
  'metadata.category'?: string;
  isDeleted?: boolean;
}

export const create = async (
  exampleData: CreateExampleInput
): Promise<mongoose.HydratedDocument<IExample>> => {
  try {
    logger.info('Creating new example item in repository', {
      name: exampleData.name,
    });

    const exampleToCreate = toExample(exampleData);
    const example = new Example(exampleToCreate);
    const savedExample = await example.save();

    logger.info('Example item created successfully in repository', {
      exampleId: savedExample._id,
    });
    return savedExample;
  } catch (error) {
    logger.error('Error creating example item in repository:', error);
    throw error;
  }
};

export const find = async (
  page: number = 1,
  limit: number = 10,
  category?: string,
  isDeleted?: boolean
): Promise<{
  examples: mongoose.HydratedDocument<IExample>[];
  total: number;
}> => {
  try {
    const skip = (page - 1) * limit;

    const filter: ExampleFilter = {};
    if (category) filter['metadata.category'] = category;
    if (isDeleted !== undefined) filter.isDeleted = isDeleted;

    const [examples, total] = await Promise.all([
      Example.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Example.countDocuments(filter),
    ]);

    logger.info('Example items retrieved successfully from repository', {
      count: examples.length,
      page,
      limit,
    });
    return { examples, total };
  } catch (error) {
    logger.error('Error retrieving example items from repository:', error);
    throw error;
  }
};

export const findById = async (
  exampleId: string
): Promise<mongoose.HydratedDocument<IExample> | null> => {
  try {
    const example = await Example.findById(exampleId);

    if (!example) {
      logger.warn('Example item not found in repository', { exampleId });
      return null;
    }

    logger.info('Example item retrieved successfully from repository', {
      exampleId,
    });
    return example;
  } catch (error) {
    logger.error('Error retrieving example item from repository:', error);
    throw error;
  }
};

export const update = async (
  exampleId: string,
  updateData: UpdateExampleInput
): Promise<mongoose.HydratedDocument<IExample> | null> => {
  try {
    const exampleToUpdate = toExampleUpdate(updateData);
    const example = await Example.findByIdAndUpdate(
      exampleId,
      { $set: exampleToUpdate },
      { new: true, runValidators: true }
    );

    if (!example) {
      logger.warn('Example item not found for update in repository', {
        exampleId,
      });
      return null;
    }

    logger.info('Example item updated successfully in repository', {
      exampleId,
    });
    return example;
  } catch (error) {
    logger.error('Error updating example item in repository:', error);
    throw error;
  }
};

export const softDelete = async (exampleId: string): Promise<boolean> => {
  try {
    const example = await Example.findByIdAndUpdate(
      exampleId,
      { isDeleted: true },
      { new: true }
    );

    if (!example) {
      logger.warn('Example item not found for deletion in repository', {
        exampleId,
      });
      return false;
    }

    logger.info('Example item deleted successfully in repository', {
      exampleId,
    });
    return true;
  } catch (error) {
    logger.error('Error deleting example item in repository:', error);
    throw error;
  }
};

export const findByCategory = async (
  category: string
): Promise<mongoose.HydratedDocument<IExample>[]> => {
  try {
    const examples = await Example.find({
      'metadata.category': category,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    logger.info('Examples retrieved by category from repository', {
      category,
      count: examples.length,
    });
    return examples;
  } catch (error) {
    logger.error(
      'Error retrieving examples by category from repository:',
      error
    );
    throw error;
  }
};

export const search = async (
  searchTerm: string
): Promise<mongoose.HydratedDocument<IExample>[]> => {
  try {
    const examples = await Example.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ],
      isDeleted: false,
    }).sort({ createdAt: -1 });

    logger.info('Examples searched successfully in repository', {
      searchTerm,
      count: examples.length,
    });
    return examples;
  } catch (error) {
    logger.error('Error searching examples in repository:', error);
    throw error;
  }
};
