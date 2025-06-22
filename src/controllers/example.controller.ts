import { Request, Response } from 'express';
import * as exampleService from '../services/example.service';
import { logger } from '../utils';

/**
 * Create a new example item
 * POST /api/examples
 */
export const createExample = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const exampleData = req.body;

    // Basic validation
    if (
      !exampleData.name ||
      !exampleData.description ||
      !exampleData.price ||
      !exampleData.metadata?.category
    ) {
      res.status(400).json({
        success: false,
        message:
          'Missing required fields: name, description, price, and metadata.category are required',
      });
      return;
    }

    const example = await exampleService.createExample(exampleData);

    res.status(201).json({
      success: true,
      data: example,
      message: 'Example item created successfully',
    });
  } catch (error: any) {
    logger.error('Error in createExample controller:', error);

    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err: any) => err.message),
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Get all example items with pagination and filtering
 * GET /api/examples
 */
export const getExamples = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const isDeleted =
      req.query.isDeleted !== undefined
        ? req.query.isDeleted === 'true'
        : undefined;

    const result = await exampleService.getExamples(
      page,
      limit,
      category,
      isDeleted
    );

    res.status(200).json({
      success: true,
      data: result.examples,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit),
      },
    });
  } catch (error) {
    logger.error('Error in getExamples controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Get example item by ID
 * GET /api/examples/:id
 */
export const getExampleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Example ID is required',
      });
      return;
    }

    const example = await exampleService.getExampleById(id);

    if (!example) {
      res.status(404).json({
        success: false,
        message: 'Example item not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: example,
    });
  } catch (error) {
    logger.error('Error in getExampleById controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Update example item
 * PUT /api/examples/:id
 */
export const updateExample = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Example ID is required',
      });
      return;
    }

    const example = await exampleService.updateExample(id, updateData);

    if (!example) {
      res.status(404).json({
        success: false,
        message: 'Example item not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: example,
      message: 'Example item updated successfully',
    });
  } catch (error: any) {
    logger.error('Error in updateExample controller:', error);

    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err: any) => err.message),
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Delete example item (soft delete)
 * DELETE /api/examples/:id
 */
export const deleteExample = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Example ID is required',
      });
      return;
    }

    const deleted = await exampleService.deleteExample(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Example item not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Example item deleted successfully',
    });
  } catch (error) {
    logger.error('Error in deleteExample controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Get examples by category
 * GET /api/examples/category/:category
 */
export const getExamplesByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category } = req.params;

    if (!category) {
      res.status(400).json({
        success: false,
        message: 'Category is required',
      });
      return;
    }

    const examples = await exampleService.getExamplesByCategory(category);

    res.status(200).json({
      success: true,
      data: examples,
      count: examples.length,
    });
  } catch (error) {
    logger.error('Error in getExamplesByCategory controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Search examples by name or description
 * GET /api/examples/search
 */
export const searchExamples = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
      return;
    }

    const examples = await exampleService.searchExamples(q);

    res.status(200).json({
      success: true,
      data: examples,
      count: examples.length,
      query: q,
    });
  } catch (error) {
    logger.error('Error in searchExamples controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
