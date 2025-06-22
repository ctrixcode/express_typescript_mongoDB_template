import bodyParser from 'body-parser';

export const bodyParserMiddleware = [
  bodyParser.json({ limit: '10mb' }),
  bodyParser.urlencoded({ extended: true, limit: '10mb' }),
  bodyParser.text({ limit: '10mb' }),
  bodyParser.raw({ limit: '10mb' }),
];
