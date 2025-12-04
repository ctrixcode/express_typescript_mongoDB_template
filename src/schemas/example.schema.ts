import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     Example:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - metadata
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the example
 *         name:
 *           type: string
 *           description: The name of the example
 *         description:
 *           type: string
 *           description: The description of the example
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of tags
 *         price:
 *           type: number
 *           format: float
 *           description: The price of the example
 *         metadata:
 *           type: object
 *           properties:
 *             category:
 *               type: string
 *               enum: [electronics, clothing, books, food, other]
 *             priority:
 *               type: string
 *               enum: [low, medium, high]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the example was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the example was last updated
 *       example:
 *         _id: 60d0fe4f5311236168a109ca
 *         name: "Sample Item"
 *         description: "This is a sample item."
 *         tags: ["sample", "testing"]
 *         price: 99.99
 *         metadata:
 *           category: "electronics"
 *           priority: "medium"
 *         createdAt: "2023-01-01T12:00:00.000Z"
 *         updatedAt: "2023-01-01T12:00:00.000Z"
 */

export const createExampleSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(1).max(500),
    tags: z.array(z.string()).max(10).optional(),
    price: z.number().min(0).max(10000),
    metadata: z.object({
      category: z.enum(['electronics', 'clothing', 'books', 'food', 'other']),
      priority: z.enum(['low', 'medium', 'high']).optional(),
    }),
  }),
});

export const updateExampleSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().min(1).max(500).optional(),
    tags: z.array(z.string()).max(10).optional(),
    price: z.number().min(0).max(10000).optional(),
    metadata: z
      .object({
        category: z
          .enum(['electronics', 'clothing', 'books', 'food', 'other'])
          .optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
      })
      .optional(),
  }),
});

export type CreateExampleInput = z.infer<typeof createExampleSchema>['body'];
export type UpdateExampleInput = z.infer<typeof updateExampleSchema>['body'];
