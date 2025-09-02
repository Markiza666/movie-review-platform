import type{ Request, Response } from 'express';
import Movie from '../models/Movie.js';
import Review from '../models/Review.js';
import type{ AuthRequest } from '../interfaces/index.js';

// Get all movies
const getMovies = async (req: Request, res: Response) => {
  const movies = await Movie.find({});
  res.json(movies);
};

// Get a single movie by ID
const getMovieById = async (req: Request, res: Response) => {
  const movie = await Movie.findById(req.params.id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
};

// Get all reviews for a specific movie
const getMovieReviews = async (req: Request, res: Response) => {
  const reviews = await Review.find({ movieId: req.params.id }).populate('userId', 'username');
  res.json(reviews);
};

// Add a new movie (Admin only)
const addMovie = async (req: AuthRequest, res: Response) => {
  const { title, director, releaseYear, genre } = req.body;
  const movie = await Movie.create({ title, director, releaseYear, genre });
  res.status(201).json(movie);
};

// Update a movie by ID (Admin only)
const updateMovie = async (req: AuthRequest, res: Response) => {
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

// Delete a movie by ID (Admin only)
const deleteMovie = async (req: AuthRequest, res: Response) => {
  const movie = await Movie.findById(req.params.id);

  if (movie) {
    await movie.deleteOne();
    res.json({ message: 'Movie removed' });
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
};

// Get all movies with their average rating
const getMoviesWithRatings = async (req: Request, res: Response) => {
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

export default {
  getMovies,
  getMovieById,
  getMovieReviews,
  addMovie,
  updateMovie,
  deleteMovie,
  getMoviesWithRatings,
};
