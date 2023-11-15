import { Router, Request, Response } from 'express';

export const abcdRouter = Router();

/**
 * @swagger
 * /ab?cd:
 *   get:
 *     description: This endpoint is valid for /abcd and /acd
 *     responses:
 *       200:
 *         description: ab?cd
 */
abcdRouter.get('/ab?cd', (req: Request, res: Response): void => {
  try {
    res.send('ab?cd');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
