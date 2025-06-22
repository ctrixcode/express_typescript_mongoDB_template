import { Router } from 'express';
import * as exampleController from '../controllers/example.controller';

const router = Router();

/**
 * @route   POST /api/examples
 * @desc    Create a new example item
 * @access  Public
 */
router.post('/', exampleController.createExample);

/**
 * @route   GET /api/examples
 * @desc    Get all example items with pagination and filtering
 * @access  Public
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10)
 * @query   category - Filter by category
 * @query   isDeleted - Filter by deleted status (true/false)
 */
router.get('/', exampleController.getExamples);

/**
 * @route   GET /api/examples/search
 * @desc    Search examples by name or description
 * @access  Public
 * @query   q - Search query
 */
router.get('/search', exampleController.searchExamples);

/**
 * @route   GET /api/examples/category/:category
 * @desc    Get examples by category
 * @access  Public
 * @param   category - Category name
 */
router.get('/category/:category', exampleController.getExamplesByCategory);

/**
 * @route   GET /api/examples/:id
 * @desc    Get example item by ID
 * @access  Public
 * @param   id - Example item ID
 */
router.get('/:id', exampleController.getExampleById);

/**
 * @route   PUT /api/examples/:id
 * @desc    Update example item
 * @access  Public
 * @param   id - Example item ID
 */
router.put('/:id', exampleController.updateExample);

/**
 * @route   DELETE /api/examples/:id
 * @desc    Delete example item (soft delete)
 * @access  Public
 * @param   id - Example item ID
 */
router.delete('/:id', exampleController.deleteExample);

export default router;
