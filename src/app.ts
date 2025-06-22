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
} from './middlewares';
import routes from './routes';

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting middleware
app.use(generalLimiter);

// Other Middlewares
app.use(corsMiddleware);
app.use(bodyParserMiddleware);
app.use(cookieParser());
app.use(requestLogger);
app.use(routes);
app.use('*', notFoundHandler);
app.use(errorHandler);

export default app;
