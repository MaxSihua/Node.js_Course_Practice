import { Router } from 'express';

export const aboutRouter = Router();

/**
 * @swagger
 * /about:
 *   get:
 *     description: Get information about the About page
 *     responses:
 *       200:
 *         description: Information about the About page
 */
aboutRouter.get('/', (req, res) => {
  res.send('about');
});



