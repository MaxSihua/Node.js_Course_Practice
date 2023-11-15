import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

import BadRequestError from '../errors/BadRequestError';

import { Movie } from '../schemas/movies';

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
  const movies = await Movie.find().catch((err: Error) => {
    throw new BadRequestError({code: 404, message: err.message });
  });

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

    const movies = await Movie.find({ genre: name })
    .then((movies) => {
      return movies;
    })
    .catch((err: Error) => {
      throw new BadRequestError({code: 404, message: err.message });
    });
    
        res.status(200).json(movies);
  });
  
  
  /**
   * @swagger
   * /movies:
   *   post:
   *     summary: Add a new movie
   *     description: Add a new movie to the database.
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
  
  addNewMovieRouter.post('/', async (req: Request, res: Response): Promise<void> => {
    const { title, genre, releaseDate, description } = req.body;
    const newMovie = new Movie({
      "title": title,
      "genre": genre,
      "releaseDate": releaseDate,
      "description": description,
    });
  
    if (!title) {
      throw new BadRequestError({code: 400, message: "Title was not provided."});
    }

    await newMovie.save().catch((err: Error) => {
      throw new BadRequestError({code: 404, message: err.message });
    });

    const movies = await Movie.find()
    .then((movies) => {
      return movies;
    })
    .catch((err: Error) => {
      throw new BadRequestError({code: 404, message: err.message });
    });
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
    const { title } = req.params;

    if (!title) {
      throw new BadRequestError({code: 400, message: "Title was not provided."});
    }

    const movie = await Movie.findOne({ title: title })
    .then((movie) => {
      if ( !movie ) {
        throw new BadRequestError({code: 404, message: 'No movies where found' });
      }
        return movie;
    })
    .catch((err: Error) => {
        throw new BadRequestError({code: 404, message: err.message });
    });

    const editedMovie = {
        "title": title + '1',
        "genre": movie.genre,
        "releaseDate": movie.releaseDate,
        "description": movie.description
    };

    await Movie.findOneAndUpdate({ title: title }, { $set: editedMovie }).catch((err: Error) => {
        throw new BadRequestError({code: 404, message: err.message });
    });

    const movieCollection = await Movie.find()
    .then((movies) => {
        return movies;
    })
    .catch((err: Error) => {
        throw new BadRequestError({code: 404, message: err.message });
    });
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
   *           format: ObjectId
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
  
    await Movie.findByIdAndDelete({ _id: new ObjectId(id) })
    .catch((err: Error) => {
        throw new BadRequestError({code: 404, message: err.message });
    });

    const movieCollection = await Movie.find()
    .then((movies) => {
        return movies;
    })
    .catch((err: Error) => {
        throw new BadRequestError({code: 404, message: err.message });
    });
    res.status(200).json(movieCollection);
  });