import { Router, Request, Response } from 'express';

export const healthCheckRouter = Router();

/**
 * @swagger
 * /health-check:
 *   get:
 *     description: Check if the server is up and running
 *     responses:
 *       200:
 *         description: Server is up and running
 */
healthCheckRouter.get('/', (req: Request, res: Response): void => {
    res.json({ status: 'ok', message: 'Server is working!' });
  });
  
