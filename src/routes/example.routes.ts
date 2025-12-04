import { Router } from 'express';
import * as exampleController from '../controllers/example.controller';
import { validate } from '../middlewares/validate';
import {
  createExampleSchema,
  updateExampleSchema,
} from '../schemas/example.schema';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Examples
 *   description: The example managing API
 */

/**
 * @swagger
 * /examples:
 *   post:
 *     summary: Create a new example
 *     tags: [Examples]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Example'
 *     responses:
 *       201:
 *         description: The example was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Example'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Some server error
 */
router.post(
  '/',
  validate(createExampleSchema),
  exampleController.createExample
);

/**
 * @swagger
 * /examples:
 *   get:
 *     summary: Returns the list of all the examples
 *     tags: [Examples]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items to return
 *     responses:
 *       200:
 *         description: The list of the examples
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Example'
 *       500:
 *         description: Some server error
 */
router.get('/', exampleController.getExamples);

/**
 * @swagger
 * /examples/{id}:
 *   get:
 *     summary: Get the example by id
 *     tags: [Examples]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The example id
 *     responses:
 *       200:
 *         description: The example description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Example'
 *       404:
 *         description: The example was not found
 *       500:
 *         description: Some server error
 */
router.get('/:id', exampleController.getExampleById);

/**
 * @swagger
 * /examples/{id}:
 *  put:
 *    summary: Update the example by the id
 *    tags: [Examples]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The example id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Example'
 *    responses:
 *      200:
 *        description: The example was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Example'
 *      404:
 *        description: The example was not found
 *      400:
 *        description: Bad request
 *      500:
 *        description: Some server error
 */
router.put(
  '/:id',
  validate(updateExampleSchema),
  exampleController.updateExample
);

/**
 * @swagger
 * /examples/{id}:
 *   delete:
 *     summary: Remove the example by id
 *     tags: [Examples]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The example id
 *
 *     responses:
 *       204:
 *         description: The example was deleted
 *       404:
 *         description: The example was not found
 *       500:
 *         description: Some server error
 */
router.delete('/:id', exampleController.deleteExample);

export default router;
