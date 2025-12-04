import swaggerJSDoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express TS MongoDB Template API',
    version,
    description:
      'A template for building REST APIs with Express, TypeScript, and MongoDB, documented with Swagger.',
    license: {
      name: 'ISC',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
  ],
};

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ['./src/routes/index.ts', './src/routes/*.ts', './src/schemas/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
