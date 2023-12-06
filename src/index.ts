import express, { Application, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { connectToDb, getDb } from './db';
import { Connection } from 'mongoose';
import "express-async-errors";
import { config } from 'dotenv';

import { aboutRouter } from './resources/about';
import { healthCheckRouter } from './resources/health-check';
import { swaggerSpec } from './swagger/configs';
import { abcdRouter } from './resources/ab-сd';
import { getAllMoviesRouter,
  getMoviesByGenreRouter,
  addNewMovieRouter,
  updateMovieByTitleRouter,
  deleteMovieByIdRouter} from './resources/movies';
import { getAllGenresRouter,
  addNewGenreRouter,
  updateGenreByTitleRouter,
  deleteGenreByIdRouter } from './resources/genre'
import { errorHandler } from './middlewares/errors';

export const app: Application = express();
export let db: Connection;

config(); 

const port = process.env.PORT || 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

app.use('/health-check', healthCheckRouter);

app.use('/about', aboutRouter);

app.use('/ab?cd', abcdRouter);

app.use('/movies', getAllMoviesRouter);

app.use('/movies/genres', getMoviesByGenreRouter);

app.use('/movies', addNewMovieRouter);

app.use('/movies', updateMovieByTitleRouter);

app.use('/movies', deleteMovieByIdRouter);

app.use('/genres', getAllGenresRouter);

app.use('/genres', addNewGenreRouter);

app.use('/genres', updateGenreByTitleRouter);

app.use('/genres', deleteGenreByIdRouter);

app.use((req: Request, res: Response): void => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

connectToDb((err: Error | null) => {
  if (!err) {
      console.log('connected to db')
      if (process.env.NODE_ENV !== 'test') {
        // Запускаємо сервер лише у разі, якщо не тестовий режим
        app.listen(port, () => {
          console.log(`Example app listening at http://localhost:${port}`);
        });
      }

      db = getDb();
  }
});

export default app;
