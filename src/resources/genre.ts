import { Router, Request, Response } from 'express';
import mongose from 'mongoose';

import BadRequestError from '../errors/BadRequestError';

import { Genres } from '../schemas/genres';

import Joi from 'joi';

export const getAllGenresRouter = Router();
export const addNewGenreRouter = Router();
export const updateGenreByTitleRouter = Router();
export const deleteGenreByIdRouter = Router();

const ObjectId = mongose.Types.ObjectId;

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
 *       400:
 *         description: Internal server error.
 */
getAllGenresRouter.get('/', async (req: Request, res: Response): Promise<void> => {
    await Genres.find()
    .then((genres) => {
        if (genres.length === 0) {
            throw new BadRequestError({code: 400, message: "No genres was found." });
        }
        res.status(200).json(genres);
    })
    .catch((err: Error) => {
        throw new BadRequestError({code: 400, message: err.message });
    });
  });
  
  /**
   * @swagger
   * /genres:
   *   post:
   *     summary: Add a new genre
   *     description: Add a new genre to the database.
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
   *        description: Bad request - Genre not provided.
   *       404:
   *         description: Bad request - Invalid data provided.
   */

  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required()
});

addNewGenreRouter.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;

        await schema.validateAsync({ name });

        const genre = { "name": name };

        await Genres.create(genre);

        const genres = await Genres.find();
        res.status(201).json(genres);
    } catch (error: any) {
        if (Joi.isError(error)) {
            const message = error.details[0].message;
            throw new BadRequestError({ code: 400, message });
        } else {
            throw new BadRequestError({ code: 400, message: error.message });
        }
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
   *         description: Genre ${name} was not deleted.
   */
  updateGenreByTitleRouter.put('/:name', async (req: Request, res: Response): Promise<void> => {
    const { name } = req.params;
    const randomSuffix = Math.floor(Math.random() * 1000); 
    await Genres.findOne({ name: name })
    .then((genre) => {
        return genre;
    })
    .catch((err: Error) => {
        throw new BadRequestError({code: 400, message: err.message });
    });

    const editedGenre = {
        "name": name + " " + randomSuffix
    };

    await Genres.findOneAndUpdate({ name: name }, { $set: editedGenre })
    .catch((err: Error) => {
        throw new BadRequestError({code: 404, message: err.message });
    });

    const genreCollection = await Genres.find()
    .then((genres) => {
        return genres;
    })
    .catch((err: Error) => {
        throw new BadRequestError({code: 400, message: err.message });
    });
    res.status(200).json(genreCollection);
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
   *      200:
   *         description: Genre deleted successfully.
   *      400:
   *        description: Id not provided.
   *      404:
   *         description: Genre was not deleted.
   */
  deleteGenreByIdRouter.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
  
    if (!id) {
        throw new BadRequestError({ code: 400, message: "Id not provided."});
    }

    await Genres.findByIdAndDelete({ _id: new ObjectId(id) })
    .catch((err: Error) => {
        throw new BadRequestError({ code: 404, message: err.message});
    });

    const genreCollection = await Genres.find()
    .then((genres) => {
        return genres;
    })
    .catch((err: Error) => {
        throw new BadRequestError({ code: 400, message: err.message});
    });
    res.status(200).json(genreCollection);
  });
  