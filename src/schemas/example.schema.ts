import { z } from 'zod';

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
