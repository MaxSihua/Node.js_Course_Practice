import express, { Request, Response, Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { connectToDb, getDb } from './db';
import { Db } from 'mongodb';

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

const app: Application = express();
export let db: Db;

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

app.use((err: Error, req: Request, res: Response): void => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

connectToDb((err: Error | null) => {
    console.log(err)
    if (!err) {
      console.log('connected to db')
      app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
      });
  
      db = getDb();
    }
});
