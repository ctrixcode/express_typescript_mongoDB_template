import { Request, Response } from 'express';
import * as exampleService from '../services/example.service';
import { toExampleDto } from '../mappers/example.mapper';
import {
  CreateExampleInput,
  UpdateExampleInput,
} from '../schemas/example.schema';
import { asyncHandler } from '../utils/asyncHandler';
import { success as successMessages } from '../constants/messages';

/**
 * Create a new example item
 */
export const createExample = asyncHandler(
  async (
    req: Request<object, object, CreateExampleInput>,
    res: Response
  ): Promise<void> => {
    const example = await exampleService.createExample(req.body);
    const exampleDto = toExampleDto(example);

    res.status(201).json({
      status: 'success',
      message: successMessages.CREATED('Example'),
      data: exampleDto,
    });
  }
);

/**
 * Get all example items with pagination and filtering
 */
export const getExamples = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
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

    const examplesDto = result.examples.map(toExampleDto);

    res.status(200).json({
      status: 'success',
      message: successMessages.FETCHED('Examples'),
      data: examplesDto,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit),
      },
    });
  }
);

/**
 * Get example item by ID
 */
export const getExampleById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const example = await exampleService.getExampleById(id);
    const exampleDto = toExampleDto(example);

    res.status(200).json({
      status: 'success',
      message: successMessages.FETCHED('Example'),
      data: exampleDto,
    });
  }
);

/**
 * Update example item
 */
export const updateExample = asyncHandler(
  async (
    req: Request<{ id: string }, object, UpdateExampleInput>,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const example = await exampleService.updateExample(id, req.body);
    const exampleDto = toExampleDto(example);

    res.status(200).json({
      status: 'success',
      message: successMessages.UPDATED('Example'),
      data: exampleDto,
    });
  }
);

/**
 * Delete example item (soft delete)
 */
export const deleteExample = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await exampleService.deleteExample(id);
    res.status(204).send(); // No content
  }
);

/**
 * Get examples by category
 */
export const getExamplesByCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { category } = req.params;
    const examples = await exampleService.getExamplesByCategory(category);
    const examplesDto = examples.map(toExampleDto);

    res.status(200).json({
      status: 'success',
      message: successMessages.FETCHED('Examples'),
      data: examplesDto,
    });
  }
);

/**
 * Search examples by name or description
 */
export const searchExamples = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { q } = req.query;
    const examples = await exampleService.searchExamples(q as string);
    const examplesDto = examples.map(toExampleDto);

    res.status(200).json({
      status: 'success',
      message: successMessages.FETCHED('Examples'),
      data: examplesDto,
    });
  }
);
