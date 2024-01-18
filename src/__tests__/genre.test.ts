import request from 'supertest';
import app from '../index';
import { ObjectId } from 'mongodb';
import { Genres } from '../schemas/genres';

describe('Genres API', () => {
  let addedGenreId: string;

  // Test case for creating a new genre
  it('should add a new genre', async () => {
    const newGenre = {
      name: 'New Genre',
    };

    Genres.create = jest.fn().mockResolvedValue(newGenre);

    const response = await request(app)
      .post('/genres')
      .send(newGenre);

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body).toBeInstanceOf(Array);

    addedGenreId = response.body[0]._id;
  });

  it('should not add new genre and get 404 error', async () => {
    const newGenre = {
      name: 'New Genre',
    };

    Genres.create = jest.fn().mockRejectedValueOnce(new Error('Async error'))

    const response = await request(app)
      .post('/genres1')
      .send(newGenre);
      console.log(response.body)

    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBe('Not Found');
  });

  it('should not add new genre and get 400 error', async () => {
    const newGenre = {
      names: 'New Genre',
    };

    Genres.create = jest.fn().mockRejectedValueOnce(new Error('Async error'))

    const response = await request(app)
      .post('/genres')
      .send(newGenre);

    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
  });

  // Test case for getting a list of all genres
  it('should get a list of all genres', async () => {
    const genres = [{
      "_id": {
        "$oid": "656b19af4e7963ede1d14951"
      },
      "name": "Adventure1"
    }];

    Genres.find = jest.fn().mockResolvedValue(genres)

    const response = await request(app).get('/genres');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toEqual(genres.length);
    expect(response.body).toEqual(genres);
  });

  it('should not return genres and get a 404 error', async () => {
    Genres.find = jest.fn().mockRejectedValueOnce(new Error('Async error'))

    const response = await request(app).get('/genress');

    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
  });

  // Test case for updating a genre by name
  it('should update a genre by name', async () => {
    const genreName = 'New';
    const newGenre = {
      name: genreName,
    };
    const editedGenre = {
      name: "New1"
    }

    Genres.findOne = jest.fn().mockResolvedValue(newGenre);
    Genres.findByIdAndUpdate = jest.fn().mockResolvedValue(editedGenre);
    Genres.find = jest.fn().mockResolvedValue([editedGenre])

    await request(app)
      .post('/genres')
      .send(newGenre);

    const response = await request(app)
      .put(`/genres/${genreName}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should not update genre and get error 400', async () => {
    const genreName = 'Comedya';

    Genres.findOne = jest.fn().mockRejectedValueOnce(new Error('No genre'))

    const response = await request(app)
      .put(`/genres/${genreName}`)


    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
  });

  // Test case for deleting a genre by ID
  it('should delete a genre by ID', async () => {
    const fakeGenre = {
      '_id':'6570622ae3e6936173eab8ad',
      'name':"New Genre"
    }

    Genres.findByIdAndDelete = jest.fn().mockResolvedValueOnce(fakeGenre)

    const response = await request(app).delete(`/genres/6570622ae3e6936173eab8ad`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it('should not delete a genre by ID end get 404 error', async () => {
    const fakeId = new ObjectId('6570622ae3e6936173eab8ad');

    Genres.findByIdAndDelete = jest.fn().mockRejectedValueOnce(fakeId);

    const response = await request(app).delete(`/genres/${fakeId}`);

    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
  });

  // Clean up: delete the genre created in the first test case
  afterAll(async () => {
    await request(app).delete(`/genres/${addedGenreId}`);
  });
});
