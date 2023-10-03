import express, { Request, Response } from 'express';
import swaggerJsdoc, { OAS3Definition } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { Application } from 'express';

interface ServerSatatus {
  status: string;
  message: string;
}

interface Genre {
  name: string;
}

const moviesDB = [
  {
    title: 'Avatar',
    genre: ['Action, Adventure, Fantasy'],
    releaseDate: '18 Dec 2009',
    description: 'garbage film',
  },
  {
    title: 'Lord of the Rings',
    genre: ['Action, Adventure, Fantasy'],
    releaseDate: '19 Dec 2001',
    description: 'best film ever',
  },
  {
    title: 'Avatar: The Way of Water',
    genre: ['Action, Adventure, Fantasy'],
    releaseDate: '06 Dec 2022',
    description: 'very-very garbage film',
  },
];

const genresDB: Genre[] = [
  {
    name: 'Action, Adventure, Fantasy',
  },
];

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
  apis: ['index.ts'],
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
 * /movies:
 *   get:
 *     description: Get a list of all movies
 *     responses:
 *       200:
 *         description: List of movies
 */
app.get('/movies', (req: Request, res: Response): void => {
  res.json(moviesDB);
});

/**
 * @swagger
 * /movies:
 *   post:
 *     description: Create a new movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *               releaseDate:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movie created successfully
 */
app.post('/movies', (req: Request, res: Response): void => {
  const newMovie = req.body;
  moviesDB.push(newMovie);
  res.status(201).json({ message: 'Movie created successfully' });
});

/**
 * @swagger
 * /movies/{title}:
 *   get:
 *     description: Get a specific movie by title
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie details
 *       404:
 *         description: Movie not found
 */
app.get('/movies/:title', (req: Request, res: Response): void => {
  const { title } = req.params;
  const movie = moviesDB.find((m) => m.title === title);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
});

/**
 * @swagger
 * /movies/{title}:
 *   put:
 *     description: Update a specific movie by title
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *               releaseDate:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       404:
 *         description: Movie not found
 */
app.put('/movies/:title', (req: Request, res: Response): void => {
  const { title } = req.params;
  const updatedMovie = req.body;
  const index = moviesDB.findIndex((m) => m.title === title);
  if (index !== -1) {
    moviesDB[index] = updatedMovie;
    res.json({ message: 'Movie updated successfully' });
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
});

/**
 * @swagger
 * /movies/{title}:
 *   delete:
 *     description: Delete a specific movie by title
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 */
app.delete('/movies/:title', (req: Request, res: Response): void => {
  const { title } = req.params;
  const index = moviesDB.findIndex((m) => m.title === title);
  if (index !== -1) {
    moviesDB.splice(index, 1);
    res.json({ message: 'Movie deleted successfully' });
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
});

/**
 * @swagger
 * /genres:
 *   get:
 *     description: Get a list of all genres
 *     responses:
 *       200:
 *         description: List of genres
 */
app.get('/genres', (req: Request, res: Response): void => {
  res.json(genresDB);
});

/**
 * @swagger
 * /genres:
 *   post:
 *     description: Create a new genre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Genre created successfully
 */
app.post('/genres', (req: Request, res: Response): void => {
  const newGenre: Genre = req.body;
  genresDB.push(newGenre);
  res.status(201).json({ message: 'Genre created successfully' });
});

/**
 * @swagger
 * /genres/{name}:
 *   get:
 *     description: Get a specific genre by name
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Genre details
 *       404:
 *         description: Genre not found
 */
app.get('/genres/:name', (req: Request, res: Response): void => {
  const { name } = req.params;
  const genre = genresDB.find((g) => g.name === name);
  if (genre) {
    res.json(genre);
  } else {
    res.status(404).json({ message: 'Genre not found' });
  }
});

/**
 * @swagger
 * /genres/{name}:
 *   put:
 *     description: Update a specific genre by name
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Genre updated successfully
 *       404:
 *         description: Genre not found
 */
app.put('/genres/:name', (req: Request, res: Response): void => {
  const { name } = req.params;
  const updatedGenre: Genre = req.body;
  const index = genresDB.findIndex((g) => g.name === name);
  if (index !== -1) {
    genresDB[index] = updatedGenre;
    res.json({ message: 'Genre updated successfully' });
  } else {
    res.status(404).json({ message: 'Genre not found' });
  }
});

/**
 * @swagger
 * /genres/{name}:
 *   delete:
 *     description: Delete a specific genre by name
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Genre deleted successfully
 *       404:
 *         description: Genre not found
 */
app.delete('/genres/:name', (req: Request, res: Response): void => {
  const { name } = req.params;
  const index = genresDB.findIndex((g) => g.name === name);
  if (index !== -1) {
    genresDB.splice(index, 1);
    res.json({ message: 'Genre deleted successfully' });
  } else {
    res.status(404).json({ message: 'Genre not found' });
  }
});


/**
 * @swagger
 * /movies/genre/{genreName}:
 *   get:
 *     description: Get movies by genre
 *     parameters:
 *       - in: path
 *         name: genreName
 *         description: The name of the genre to search for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of movies matching the genre
 */
app.get('/movies/genre/:genreName', (req: Request, res: Response): void => {
  const { genreName } = req.params;
  
  // Filter movies by genre
  const filteredMovies = moviesDB.filter((movie) =>
    movie.genre.includes(genreName)
  );

  res.json(filteredMovies);
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
