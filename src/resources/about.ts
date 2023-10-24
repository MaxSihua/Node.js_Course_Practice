import { Router, Request, Response } from 'express';


export const aboutRouter = Router();

/**
 * @swagger
 * /about:
 *   get:
 *     description: Get information about the About page
 *     responses:
 *       200:
 *         description: Information about the About page
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       500:
 *         description: Internal server error.
 */
aboutRouter.get('/', (req: Request, res: Response): void => {
  try {
      res.send('about');
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
  }
});




