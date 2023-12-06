import request from 'supertest';
import { app } from '../index';

describe('Movies API', () => {
  let addedMovieId: string;

  it('should get a list of all movies', async () => {
    const response = await request(app).get('/movies');
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should not get a list of all movies and return 404 error', async () => {
    const response = await request(app).get('/moviess');
    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
  });

  it('should get a list of movies by genre', async () => {
    const response = await request(app).get('/movies/genres/Action');
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should return an empty array for a non-existent genre', async () => {
    const response = await request(app).get('/movies/genres/NonExistentGenre');
    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
  });

  it('should add a new movie', async () => {
    const newMovie = {
      title: 'NewMovie',
      genre: ['Action'],
      releaseDate: '2023-01-01',
      description: 'A new movie.',
    };

    const response = await request(app).post('/movies').send(newMovie);
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body).toBeInstanceOf(Array);

    addedMovieId = response.body[0]._id;
  });

  it('should not add a new movie and return 400 error', async () => {
    const newMovie = {
      titles: 'NewMovie',
      genres: ['Action'],
      releaseDates: '2023-01-01',
      descriptions: 'A new movie.',
    };

    const response = await request(app).post('/movies').send(newMovie);
    expect(response.status).toBe(400);
  });

  it('should update a movie by title', async () => {
    const updatedMovie = {
      title: 'Updated Movie',
      genre: ['Action'],
      releaseDate: '2023-01-02',
      description: 'An updated movie.',
    };

    const response = await request(app).put(`/movies/NewMovie`).send(updatedMovie);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should handle updating a non-existent movie', async () => {
    const response = await request(app).put('/movies/NonExistentMovie').send({
      title: 'Updated Movie',
      genre: ['Action'],
      releaseDate: '2023-01-02',
      description: 'An updated movie.',
    });

    expect(response.status).toBe(404);
  });

  it('should delete a movie by ID', async () => {
    const moviesBeforeDelete = await request(app).get('/movies');
    const idToDelete = moviesBeforeDelete.body[0]._id;

    const response = await request(app).delete(`/movies/${idToDelete}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toBeInstanceOf(Object);
  });

  it('should delete a movie by ID', async () => {
    const fakeId = '6520106252da1e7daaf37d32'

    const response = await request(app).delete(`/movies/${fakeId}`);
    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
  });

  it('should delete a movie by ID', async () => {
    const response = await request(app).delete(`/movies/`);
    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
  });
});
