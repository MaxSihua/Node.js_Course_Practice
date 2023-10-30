import { Router, Request, Response } from 'express';
import BadRequestError from '../errors/BadRequestError';

export const healthCheckRouter = Router();

/**
 * @swagger
 * /health-check:
 *   get:
 *     description: Check if the server is up and running
 *     responses:
 *       200:
 *         description: Server is up and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Status message
 *  
 *       500:
 *         description: Server is lazy and down.
 */
healthCheckRouter.get('/', (req: Request, res: Response): void => {
    const serverIsWorking = true;

    if (!serverIsWorking) {
        throw new BadRequestError({code: 500, message: "Server is lazy and down." });
    }

    res.status(200).json({ message: "Server is up and running" });
});
  
