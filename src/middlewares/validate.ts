import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { logger } from '../utils';

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(issue => ({
          message: `${issue.path.join('.')} is ${issue.message.toLowerCase()}`,
        }));
        logger.error('Zod validation error', { errors: errorMessages });
        return res.status(400).json({ success: false, errors: errorMessages });
      }
      logger.error('Internal server error in validation middleware', { error });
      return res
        .status(500)
        .json({ success: false, message: 'Internal Server Error' });
    }
  };
