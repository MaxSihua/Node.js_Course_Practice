import { Router, Request, Response } from 'express';
import { db } from '../index';
import { ObjectId } from 'mongodb';

export const getAllGenresRouter = Router();
export const addNewGenreRouter = Router();
export const updateGenreByTitleRouter = Router();
export const deleteGenreByIdRouter = Router();

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
getAllGenresRouter.get('/', async (req: Request, res: Response): Promise<void> => {
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
  
  addNewGenreRouter.post('/:name', async (req: Request, res: Response): Promise<void> => {
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
  updateGenreByTitleRouter.put('/:name', async (req: Request, res: Response): Promise<void> => {
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
  deleteGenreByIdRouter.delete('/:id', async (req: Request, res: Response): Promise<void> => {
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
  