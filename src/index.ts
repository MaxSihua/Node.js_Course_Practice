import express, { Request, Response } from 'express';
import swaggerJsdoc, { OAS3Definition } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { Application } from 'express';

interface ServerSatatus {
  status: string;
  message: string;
}

const app: Application = express();
const port = 3000;
const serverIsWorking: ServerSatatus = {
  status: 'ok',
  message: 'Server is working!',
};

const swaggerOptions: OAS3Definition = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API Documentation',
      version: '1.0.0',
      description: 'Documentation for my API',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Local server',
      },
    ],
  },
  apis: ['src/index.ts'],
  openapi: '',
  info: {
    title: 'test swagger',
    version: '0.0.1',
  },
};

const swaggerSpec: object = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

/**
 * @swagger
 * /health-check:
 *   get:
 *     description: Check if the server is up and running
 *     responses:
 *       200:
 *         description: Server is up and running
 */
app.get('/health-check', (req: Request, res: Response): void => {
  res.json(serverIsWorking);
});

/**
 * @swagger
 * /about:
 *   get:
 *     description: Get information about the About page
 *     responses:
 *       200:
 *         description: Information about the About page
 */
app.get('/about', (req: Request, res: Response): void => {
  res.send('about');
});

/**
 * @swagger
 * /ab?cd:
 *   get:
 *     description: This endpoint is valid for /abcd and /acd
 *     responses:
 *       200:
 *         description: ab?cd
 */
app.get('/ab?cd', (req: Request, res: Response): void => {
  res.send('ab?cd');
});

app.use((req: Request, res: Response): void => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err: Error, req: Request, res: Response): void => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});