import request from 'supertest';
import app from '../index';
import { ObjectId } from 'mongodb';

describe('Genres API', () => {
  let addedGenreId: string;

  it('should add a new genre', async () => {
    const newGenre = {
      name: 'New Genre',
    };

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

    const response = await request(app)
      .post('/genres1')
      .send(newGenre);

    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
  });

  it('should not add new genre and get 400 error', async () => {
    const newGenre = {
      names: 'New Genre',
    };

    const response = await request(app)
      .post('/genres')
      .send(newGenre);

    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
  });

  it('should get a list of all genres', async () => {
    const response = await request(app).get('/genres');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should get a 404 error', async () => {
    const response = await request(app).get('/genress');

    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
  });

  it('should update a genre by name', async () => {
    const genreName = 'New';
    const newGenre = {
      name: genreName,
    };

    await request(app)
      .post('/genres')
      .send(newGenre);

    const response = await request(app)
      .put(`/genres/${genreName}`)

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should not update genre and get error 400', async () => {
    const genreName = 'Comedya';

    const response = await request(app)
      .put(`/genres/${genreName}`)


    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
  });


  it('should delete a genre by ID', async () => {
    const response = await request(app).delete(`/genres/${addedGenreId}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it('should not delete a genre by ID end get 404 error', async () => {
    const fakeId = new ObjectId('656b2dbe081db11150d78ec3');
    const response = await request(app).delete(`/genres/${fakeId}`);

    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
  });

  afterAll(async () => {
    await request(app).delete(`/genres/${addedGenreId}`);
  });
});
