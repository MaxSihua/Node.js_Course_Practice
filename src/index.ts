import express, { Request, Response, Application } from 'express';
import swaggerJsdoc, { OAS3Definition } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { connectToDb, getDb } from './db';
import { Db, ObjectId } from 'mongodb';

const app: Application = express();
const port = 3000;

let db: Db;

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
  apis: ['src/index.ts'],
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
app.get('/health-check', (req: Request, res: Response): void => {
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
app.get('/about', (req: Request, res: Response): void => {
  try {
      res.send('about');
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get a list of all movies
 *     description: Retrieve a list of all movies from the database.
 *     responses:
 *       200:
 *         description: List of movies retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Internal server error.
 */
app.get('/movies', async (req: Request, res: Response): Promise<void> => {
  try {
      const movies = await db.collection('movies').find().toArray();
      res.status(200).json(movies);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * @swagger
 * /movies/genres:
 *   get:
 *     summary: Get a list of all genres
 *     description: Retrieve a list of all genres from the database.
 *     responses:
 *       200:
 *         description: List of genres retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 *       500:
 *         description: Internal server error.
 */
app.get('/movies/genres', async (req: Request, res: Response): Promise<void> => {
  try {
    const genres = await db.collection('genres').find().toArray();
    res.status(200).json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * @swagger
 * /movies/genres/{name}:
 *   get:
 *     summary: Get a list of movies by genre
 *     description: Retrieve a list of movies by a specific genre from the database.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: The name of the genre to filter movies by.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of movies retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Genre not found.
 *       500:
 *         description: Internal server error.
 */
app.get('/movies/genres/:name', async (req: Request, res: Response): Promise<void> => {
  try {
    const name = req.params.name;
    const movies = await db.collection('movies').find({ genre: name }).toArray();

    if (movies.length === 0) {
      res.status(404).json({ error: "Genre not found." });
    } else {
      res.status(200).json(movies);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * @swagger
 * /movies/{title}:
 *   post:
 *     summary: Add a new movie
 *     description: Add a new movie to the database.
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         description: The title of the movie.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Movie object to add.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: The Matrix
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Action", "Adventure", "Science Fiction"]
 *               releaseDate:
 *                 type: string
 *                 example: 1999-03-31
 *               description:
 *                 type: string
 *                 example: A classic sci-fi movie.
 *     responses:
 *       201:
 *         description: Movie added successfully.
 *       400:
 *         description: Bad request - Invalid data provided.
 */

app.post('/movies/:title', async (req: Request, res: Response): Promise<void> => {
  const title = req.params.title;
  const movie = {
      "title": title,
      "genre": ["Action", "Adventure", "Science Fiction"],
      "releaseDate": "1999-03-31",
      "description": "A classic sci-fi movie."
  };

  if (!title) {
      res.status(400).json({ error: "Title is required." });
      return;
  }

  try {
      await db.collection('movies').insertOne(movie);
      const movies = await db.collection('movies').find().toArray();
      res.status(201).json(movies);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * @swagger
 * /movies/{title}:
 *   put:
 *     summary: Update a movie by title
 *     description: Update a movie in the database by its title.
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         description: The title of the movie to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: New movie data to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: The Matrix
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Action", "Adventure", "Science Fiction"]
 *               releaseDate:
 *                 type: string
 *                 example: 1999-03-31
 *               description:
 *                 type: string
 *                 example: A classic sci-fi movie.
 *     responses:
 *       200:
 *         description: Movie updated successfully.
 *       400:
 *         description: Bad request - Invalid data provided.
 *       404:
 *         description: Movie not found.
 */
app.put('/movies/:title', async (req: Request, res: Response): Promise<void> => {
  const title = req.params.title;
  const movie = await db.collection('movies').findOne({ title: title });

  if (!movie) {
      res.status(404).json({ error: "Movie not found." });
      return;
  }

  const editedMovie = {
      "title": req.body.title,
      "genre": req.body.genre,
      "releaseDate": req.body.releaseDate,
      "description": req.body.description
  };

  try {
      await db.collection('movies').updateOne({ title: title }, { $set: editedMovie });
      const movieCollection = await db.collection('movies').find().toArray();
      res.status(200).json(movieCollection);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie by ID
 *     description: Delete a movie from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the movie to delete.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Movie deleted successfully.
 *       404:
 *         description: Movie not found.
 */
app.delete('/movies/:id', async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  try {
      const result = await db.collection('movies').deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
          res.status(404).json({ error: "Movie not found." });
      } else {
          const movieCollection = await db.collection('movies').find().toArray();
          res.status(200).json(movieCollection);
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * @swagger
 * /genres:
 *   get:
 *     summary: Get a list of all genres
 *     description: Retrieve a list of all genres from the database.
 *     responses:
 *       200:
 *         description: List of genres retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 *       500:
 *         description: Internal server error.
 */
app.get('/genres', async (req: Request, res: Response): Promise<void> => {
  try {
      const genres = await db.collection('genres').find().toArray();
      res.status(200).json(genres);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * @swagger
 * /genres/{name}:
 *   post:
 *     summary: Add a new genre
 *     description: Add a new genre to the database.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: The name of the genre.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Genre object to add.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Action
 *     responses:
 *       201:
 *         description: Genre added successfully.
 *       400:
 *         description: Bad request - Invalid data provided.
 */

app.post('/genres/:name', async (req: Request, res: Response): Promise<void> => {
  const name = req.params.name;
  const genre = {
      "name": name
  };

  if (!name) {
      res.status(400).json({ error: "Name is required." });
      return;
  }

  try {
      await db.collection('genres').insertOne(genre);
      const genres = await db.collection('genres').find().toArray();
      res.status(201).json(genres);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
  }
});


/**
 * @swagger
 * /genres/{name}:
 *   put:
 *     summary: Update a genre by name
 *     description: Update a genre in the database by its name.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: The name of the genre to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: New genre data to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Action
 *     responses:
 *       200:
 *         description: Genre updated successfully.
 *       400:
 *         description: Bad request - Invalid data provided.
 *       404:
 *         description: Genre not found.
 */
app.put('/genres/:name', async (req: Request, res: Response): Promise<void> => {
  const name = req.params.name;
  const genre = await db.collection('genres').findOne({ name: name });

  if (!genre) {
      res.status(404).json({ error: "Genre not found." });
      return;
  }

  const originalGenreName = req.params.name; 
  const randomSuffix = Math.floor(Math.random() * 1000); 

  const editedGenre = {
      "name": originalGenreName + " " + randomSuffix
  };

  try {
      await db.collection('genres').updateOne({ name: name }, { $set: editedGenre });
      const genreCollection = await db.collection('genres').find().toArray();
      res.status(200).json(genreCollection);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
  }
});



/**
 * @swagger
 * /genres/{id}:
 *   delete:
 *     summary: Delete a genre by ID
 *     description: Delete a genre from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the genre to delete.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Genre deleted successfully.
 *       404:
 *         description: Genre not found.
 */
app.delete('/genres/:id', async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  try {
      const result = await db.collection('genres').deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
          res.status(404).json({ error: "Genre not found." });
      } else {
          const genreCollection = await db.collection('genres').find().toArray();
          res.status(200).json(genreCollection);
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
  }
});

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
