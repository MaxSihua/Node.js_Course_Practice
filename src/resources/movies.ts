import { Router, Request, Response } from 'express';
import { db } from '../index';
import mongoose from 'mongoose';
import BadRequestError from '../errors/BadRequestError';

export const getAllMoviesRouter = Router();
export const getMoviesByGenreRouter = Router();
export const addNewMovieRouter = Router();
export const updateMovieByTitleRouter = Router();
export const deleteMovieByIdRouter = Router();

const ObjectId = mongoose.Types.ObjectId;

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
 *       404:
 *         description: No movies was found.
 */
getAllMoviesRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  const movies = await db.collection('movies').find().toArray();

  if (movies.length === 0) {
      throw new BadRequestError({code: 404, message: "No movies was found." });
  }

  res.status(200).json(movies);
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
   *         description: Movie with title was not found.
   */
  getMoviesByGenreRouter.get('/:name', async (req: Request, res: Response): Promise<void> => {
    const { name } = req.params;
    const movies = await db.collection('movies').find({ genre: name }).toArray();

    if (movies.length === 0) {
        throw new BadRequestError({code: 404, message: `Movie with title: "${name}" was not found.`});
    } 
        res.status(200).json(movies);
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
   *         description: Title was not provided.
   *       404:
   *         description: Movie was not added.
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
      throw new BadRequestError({code: 400, message: "Title was not provided."});
    }

    const movieAdded = await db.collection('movies').insertOne(movie);

    if(!movieAdded.acknowledged) {
      throw new BadRequestError({code: 404, message: "Movie was not added."});
    }

    const movies = await db.collection('movies').find().toArray();
    res.status(201).json(movies);
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
   *         description: Title was not provided.
   *       404:
   *         description: No movies with this name was found
   */
  updateMovieByTitleRouter.put('/:title', async (req: Request, res: Response): Promise<void> => {
    const title = req.params.title;

    if (!title) {
      throw new BadRequestError({code: 400, message: "Title was not provided."});
    }

    const movie = await db.collection('movies').findOne({ title: title });

    if (!movie) {
        throw new BadRequestError({code: 404, message: "No movies with this name was found"});
    }

    const editedMovie = {
        "title": title + '1',
        "genre": movie.genre,
        "releaseDate": movie.releaseDate,
        "description": movie.description
    };

    const movieUpadated = await db.collection('movies').updateOne({ title: title }, { $set: editedMovie });

    if (!movieUpadated.acknowledged) {
        throw new BadRequestError({code: 404, message: "No movies was modified."});
    }

    const movieCollection = await db.collection('movies').find().toArray();
    res.status(200).json(movieCollection);
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
   *         description: No movies was deleted.
   */
  deleteMovieByIdRouter.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if(!id) {
      throw new BadRequestError({code: 400, message: "No id provided."});
    }
  
    const result = await db.collection('movies').deleteOne({ id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        throw new BadRequestError({code: 404, message: "No movies was deleted."});
    }
    const movieCollection = await db.collection('movies').find().toArray();
    res.status(200).json(movieCollection);
  });