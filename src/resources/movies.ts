import { Router, Request, Response } from 'express';
import { db } from '../index';
import { ObjectId } from 'mongodb';

export const getAllMoviesRouter = Router();
export const getMoviesByGenreRouter = Router();
export const addNewMovieRouter = Router();
export const updateMovieByTitleRouter = Router();
export const deleteMovieByIdRouter = Router();

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
getAllMoviesRouter.get('/', async (req: Request, res: Response): Promise<void> => {
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
  getMoviesByGenreRouter.get('/:name', async (req: Request, res: Response): Promise<void> => {
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
  
  addNewMovieRouter.post('/:title', async (req: Request, res: Response): Promise<void> => {
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
  updateMovieByTitleRouter.put('/:title', async (req: Request, res: Response): Promise<void> => {
    const title = req.params.title;
    const movie = await db.collection('movies').findOne({ title: title });
  
    if (!movie) {
        res.status(404).json({ error: "Movie not found." });
        return;
    }
  
    const editedMovie = {
        "title": title + '1',
        "genre": movie.genre,
        "releaseDate": movie.releaseDate,
        "description": movie.description
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
  deleteMovieByIdRouter.delete('/:id', async (req: Request, res: Response): Promise<void> => {
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