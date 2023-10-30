import { Router, Request, Response } from 'express';
import { db } from '../index';
import mongose from 'mongoose';
import BadRequestError from '../errors/BadRequestError';

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
    const genres = await db.collection('genres').find().toArray();

    if (genres.length === 0) {
        throw new BadRequestError({code: 400, message: "No genres was found." });
    }

    res.status(200).json(genres);
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
   *        description: Bad request - Genre not provided.
   *       404:
   *         description: Bad request - Invalid data provided.
   */
  
  addNewGenreRouter.post('/:name', async (req: Request, res: Response): Promise<void> => {
    const name = req.params.name;

    if (!name) {
        throw new BadRequestError({code: 400, message: "Genre not provided." });
    }

    const genre = {
        "name": name
    };
  
    const genrePosted = await db.collection('genres').insertOne(genre);

    if(!genrePosted.acknowledged) {
        throw new BadRequestError({code: 404, message: "Invalid data provided." });
    }

    const genres = await db.collection('genres').find().toArray();
    res.status(201).json(genres);
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
    const name = req.params.name;
    const randomSuffix = Math.floor(Math.random() * 1000); 
    const genre = await db.collection('genres').findOne({ name: name });
  
    if (!genre) {
        throw new BadRequestError({code: 400, message: "Invalid data provided." });
    }
  
    const editedGenre = {
        "name": name + " " + randomSuffix
    };
  
    const updatedGenre = await db.collection('genres').updateOne({ name: name }, { $set: editedGenre });

    if (!updatedGenre.acknowledged) {
        throw new BadRequestError({code: 404, message: `Genre ${name} was not deleted.` });
    }

    const genreCollection = await db.collection('genres').find().toArray();
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

    const result = await db.collection('genres').deleteOne({ id: new ObjectId(id) });

    if(result.deletedCount === 0) {
        throw new BadRequestError({ code: 404, message: "Genre was not deleted."});
    }

    const genreCollection = await db.collection('genres').find().toArray();
    res.status(200).json(genreCollection);
  });
  