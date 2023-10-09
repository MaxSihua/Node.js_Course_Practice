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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Status message
 *       500:
 *         description: Internal server error.
 */
healthCheckRouter.get('/', (req: Request, res: Response): void => {
  try {
      const serverIsWorking = true;
      
      if (serverIsWorking) {
          res.status(200).json({ message: "Server is up and running" });
      } else {
          res.status(500).json({ message: "Server is not working properly" });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
  }
});
  
