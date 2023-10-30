import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { connectToDb, getDb } from './db';
import { Connection } from 'mongoose';
import "express-async-errors";

import { port } from './configs';
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

const app: Application = express();
export let db: Connection;

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

app.use(errorHandler);

connectToDb((err: Error | null) => {
    if (!err) {
      console.log('connected to db')
      app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
      });
  
      db = getDb();
    }
});
