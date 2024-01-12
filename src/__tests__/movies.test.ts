import request from 'supertest';
import { app } from '../index';
import { Movie } from '../schemas/movies';
import { error } from 'console';

describe('Movies API', () => {
  let addedMovieId: string;
  const fakeMovies = [{
    "_id": {
      "$oid": "6520106252da1e7daaf37dee"
    },
    "title": "Avatar",
    "genre": [
      "Action, Adventure, Fantasy"
    ],
    "releaseDate": "18 Dec 2009",
    "description": "garbage film"
  },
  {
    "_id": {
      "$oid": "6520106252da1e7daaf37def"
    },
    "title": "Lord of the Rings",
    "genre": [
      "Action"
    ],
    "releaseDate": "19 Dec 2001",
    "description": "best film ever"
  },
  {
    "_id": {
      "$oid": "6520106252da1e7daaf37df0"
    },
    "title": "Avatar: The Way of Water",
    "genre": [
      "Action, Adventure, Fantasy"
    ],
    "releaseDate": "06 Dec 2022",
    "description": "very-very garbage film"
  }];

  it('should get a list of all movies', async () => {
    const response = await request(app).get('/movies');

    Movie.find = jest.fn().mockResolvedValue(fakeMovies);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should not get a list of all movies and return 404 error', async () => {
    const response = await request(app).get('/moviess');

    Movie.find = jest.fn().mockRejectedValue(new Error('Async error'));

    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
  });

  it('should get a list of movies by genre', async () => {
    Movie.find = jest.fn().mockResolvedValue(fakeMovies);

    const response = await request(app).get('/movies/genres/Action');

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should return an empty array for a non-existent genre', async () => {
    Movie.find = jest.fn().mockRejectedValue(new Error('Async error'));

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

    Movie.create = jest.fn().mockResolvedValueOnce(newMovie);
    Movie.find = jest.fn().mockResolvedValue([newMovie]);

    const response = await request(app).post('/movies').send(newMovie);
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body).toBeInstanceOf(Array);

    // Store the added movie's ID for cleanup
    addedMovieId = response.body[0]._id;
  });

  it('should not add a new movie and return 400 error', async () => {
    const newMovie = {
      titles: 'NewMovie',
      genres: ['Action'],
      releaseDates: '2023-01-01',
      descriptions: 'A new movie.',
    };

    Movie.create = jest.fn().mockRejectedValue(new Error('Async error'));

    const response = await request(app).post('/movies').send(newMovie);
    expect(response.status).toBe(400);
  });

  it('should update a movie by title', async () => {
    const movie = {
      title: 'Movie',
      genre: ['Action'],
      releaseDate: '2023-01-02',
      description: 'An updated movie.',
    };

    const editedMovie = {
      "title": movie.title + '1',
      "genre": movie.genre,
      "releaseDate": movie.releaseDate,
      "description": movie.description
  };

    Movie.findOne = jest.fn().mockResolvedValue(movie);
    Movie.findOneAndUpdate = jest.fn().mockResolvedValue(editedMovie);
    Movie.find = jest.fn().mockResolvedValue([editedMovie]);

    const response = await request(app).put(`/movies/NewMovie`).send(editedMovie);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should handle updating a non-existent movie', async () => {
    Movie.findOneAndUpdate = jest.fn().mockRejectedValue(new Error('Async error'));

    const response = await request(app).put('/movies/NonExistentMovie').send({
      title: 'Updated Movie',
      genre: ['Action'],
      releaseDate: '2023-01-02',
      description: 'An updated movie.',
    });

    expect(response.status).toBe(404);
  });

  it('should delete a movie by ID', async () => {
    const movie = {
      "_id": "6520106252da1e7daaf37dee",
      "title": "Avatar",
      "genre": [
        "Action, Adventure, Fantasy"
      ],
      "releaseDate": "18 Dec 2009",
      "description": "garbage film"
    }

    Movie.findByIdAndDelete = jest.fn().mockResolvedValue(movie);

    const idToDelete = "6520106252da1e7daaf37dee";

    const response = await request(app).delete(`/movies/${idToDelete}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toBeInstanceOf(Object);
  });

  it('should not delete a movie by ID when id is wrong and retuen 404', async () => {
    const fakeId = '6520106252da1e7daaf37d32'

    Movie.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('wrong ID'));

    const response = await request(app).delete(`/movies/${fakeId}`);
    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
  });

  it('should not delete a movie by ID when ID is not provided', async () => {
    Movie.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('no ID was provided'));

    const response = await request(app).delete(`/movies/`);
    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
  });
});
