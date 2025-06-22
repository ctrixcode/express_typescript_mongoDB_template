import Example, { IExample } from '../models/Example';
import { logger } from '../utils';

export interface CreateExampleData {
  name: string;
  description: string;
  isDeleted?: boolean;
  tags?: string[];
  price: number;
  metadata: {
    category: 'electronics' | 'clothing' | 'books' | 'food' | 'other';
    priority?: 'low' | 'medium' | 'high';
  };
}

export interface UpdateExampleData {
  name?: string;
  description?: string;
  isDeleted?: boolean;
  tags?: string[];
  price?: number;
  metadata?: {
    category?: 'electronics' | 'clothing' | 'books' | 'food' | 'other';
    priority?: 'low' | 'medium' | 'high';
  };
}

export interface ExampleFilter {
  'metadata.category'?: string;
  isDeleted?: boolean;
}

/**
 * Create a new example item
 */
export const createExample = async (
  exampleData: CreateExampleData
): Promise<IExample> => {
  try {
    logger.info('Creating new example item', { name: exampleData.name });

    const example = new Example(exampleData);
    const savedExample = await example.save();

    logger.info('Example item created successfully', {
      exampleId: savedExample._id,
    });
    return savedExample;
  } catch (error) {
    logger.error('Error creating example item:', error);
    throw error;
  }
};

/**
 * Get all example items with pagination and filtering
 */
export const getExamples = async (
  page: number = 1,
  limit: number = 10,
  category?: string,
  isDeleted?: boolean
): Promise<{ examples: IExample[]; total: number }> => {
  try {
    const skip = (page - 1) * limit;

    // Build filter object with proper typing
    const filter: ExampleFilter = {};
    if (category) filter['metadata.category'] = category;
    if (isDeleted !== undefined) filter.isDeleted = isDeleted;

    const [examples, total] = await Promise.all([
      Example.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Example.countDocuments(filter),
    ]);

    logger.info('Example items retrieved successfully', {
      count: examples.length,
      page,
      limit,
    });
    return { examples, total };
  } catch (error) {
    logger.error('Error retrieving example items:', error);
    throw error;
  }
};

/**
 * Get example item by ID
 */
export const getExampleById = async (
  exampleId: string
): Promise<IExample | null> => {
  try {
    const example = await Example.findById(exampleId);

    if (!example) {
      logger.warn('Example item not found', { exampleId });
      return null;
    }

    logger.info('Example item retrieved successfully', { exampleId });
    return example;
  } catch (error) {
    logger.error('Error retrieving example item:', error);
    throw error;
  }
};

/**
 * Update example item
 */
export const updateExample = async (
  exampleId: string,
  updateData: UpdateExampleData
): Promise<IExample | null> => {
  try {
    const example = await Example.findByIdAndUpdate(
      exampleId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!example) {
      logger.warn('Example item not found for update', { exampleId });
      return null;
    }

    logger.info('Example item updated successfully', { exampleId });
    return example;
  } catch (error) {
    logger.error('Error updating example item:', error);
    throw error;
  }
};

/**
 * Delete example item (soft delete)
 */
export const deleteExample = async (exampleId: string): Promise<boolean> => {
  try {
    const example = await Example.findByIdAndUpdate(
      exampleId,
      { isDeleted: true },
      { new: true }
    );

    if (!example) {
      logger.warn('Example item not found for deletion', { exampleId });
      return false;
    }

    logger.info('Example item deleted successfully', { exampleId });
    return true;
  } catch (error) {
    logger.error('Error deleting example item:', error);
    throw error;
  }
};

/**
 * Get examples by category
 */
export const getExamplesByCategory = async (
  category: string
): Promise<IExample[]> => {
  try {
    const examples = await Example.find({
      'metadata.category': category,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    logger.info('Examples retrieved by category', {
      category,
      count: examples.length,
    });
    return examples;
  } catch (error) {
    logger.error('Error retrieving examples by category:', error);
    throw error;
  }
};

/**
 * Search examples by name or description
 */
export const searchExamples = async (
  searchTerm: string
): Promise<IExample[]> => {
  try {
    const examples = await Example.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ],
      isDeleted: false,
    }).sort({ createdAt: -1 });

    logger.info('Examples searched successfully', {
      searchTerm,
      count: examples.length,
    });
    return examples;
  } catch (error) {
    logger.error('Error searching examples:', error);
    throw error;
  }
};
