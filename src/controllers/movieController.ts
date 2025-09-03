import type { Request, Response } from 'express';
import Movie from '../models/Movie.js';
import type { AuthRequest } from '../interfaces/index.js';

// @desc Get all movies
// @route GET /api/movies
// @access Public
export const getMovies = async (req: Request, res: Response) => {
  const movies = await Movie.find({});
  res.json(movies);
};

// @desc Get a single movie by ID
// @route GET /api/movies/:id
// @access Public
export const getMovieById = async (req: Request, res: Response) => {
  const movie = await Movie.findById(req.params.id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
};

// @desc Add a new movie
// @route POST /api/movies
// @access Private/Admin
export const createMovie = async (req: AuthRequest, res: Response) => {
  const { title, director, releaseYear, genre } = req.body;
  const movie = await Movie.create({ title, director, releaseYear, genre });
  res.status(201).json(movie);
};

// @desc Update a movie by ID
// @route PUT /api/movies/:id
// @access Private/Admin
export const updateMovie = async (req: AuthRequest, res: Response) => {
  const { title, director, releaseYear, genre } = req.body;
  const movie = await Movie.findById(req.params.id);

  if (movie) {
    movie.title = title || movie.title;
    movie.director = director || movie.director;
    movie.releaseYear = releaseYear || movie.releaseYear;
    movie.genre = genre || movie.genre;

    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
};

// @desc Delete a movie by ID
// @route DELETE /api/movies/:id
// @access Private/Admin
export const deleteMovie = async (req: AuthRequest, res: Response) => {
  const movie = await Movie.findById(req.params.id);

  if (movie) {
    await movie.deleteOne();
    res.json({ message: 'Movie removed' });
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
};

// @desc Get all movies with their average rating
// @route GET /api/movies/ratings
// @access Public
export const getMoviesWithRatings = async (req: Request, res: Response) => {
  const moviesWithRatings = await Movie.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'movieId',
        as: 'reviews',
      },
    },
    {
      $unwind: { path: '$reviews', preserveNullAndEmptyArrays: true },
    },
    {
      $group: {
        _id: '$_id',
        title: { $first: '$title' },
        director: { $first: '$director' },
        releaseYear: { $first: '$releaseYear' },
        genre: { $first: '$genre' },
        averageRating: { $avg: '$reviews.rating' },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        director: 1,
        releaseYear: 1,
        genre: 1,
        averageRating: { $round: ['$averageRating', 2] },
      },
    },
  ]);
  res.json(moviesWithRatings);
};
