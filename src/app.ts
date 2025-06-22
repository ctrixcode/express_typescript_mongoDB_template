import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import {
  generalLimiter,
  bodyParserMiddleware,
  corsMiddleware,
  requestLogger,
  notFoundHandler,
  errorHandler,
  sanitizeInput,
  xssProtection,
} from './middlewares/index';
import routes from './routes/index';

const app = express();

// Core Middlewares
app.use(helmet());
app.use(corsMiddleware);
app.use(generalLimiter);
app.use(bodyParserMiddleware);
app.use(cookieParser());
app.use(requestLogger);

// Security Middlewares
app.use(xssProtection);
app.use(sanitizeInput);

// API Routes
app.use('/api', routes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
