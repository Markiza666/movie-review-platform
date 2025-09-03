import type{ Request, Response } from 'express';
import Review from '../models/Review.js';
import Movie from '../models/Movie.js';
import type{ AuthRequest } from '../interfaces/index.js';

// Get all reviews for a specific movie
export const getMovieReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await Review.find({ movieId: req.params.movieId }).populate('userId', 'username');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};  

// Create a new review
export const createReview = async (req: AuthRequest, res: Response) => {
    const { movieId, rating, comment } = req.body;
    const userId = req.user?._id?.toString();

    // Check if userId is available and a string
    if (!userId) {
         return res.status(401).json({ message: 'Not authorized, user ID not found' });
    }
    try {
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const reviewExists = await Review.findOne({ movieId, userId });
        if (reviewExists) {
            return res.status(400).json({ message: 'User has already reviewed this movie' });
        }

        const review = await Review.create({
            movieId,
            userId,
            rating,
            comment,
        });
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: 'Invalid review data' });
    }
};

// Update an existing review
export const updateReview = async (req: AuthRequest, res: Response) => {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure the user is the owner of the review
    if (req.user && review.userId.toString() === (req.user as { _id: string })._id.toString()) {
        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        const updatedReview = await review.save();
        res.json(updatedReview);
    } else {
        res.status(403).json({ message: 'Not authorized to update this review' });
    }
};

// Delete a review
export const deleteReview = async (req: AuthRequest, res: Response) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
    return res.status(404).json({ message: 'Review not found' });
}

// Ensure the user is the owner of the review
if (req.user && review.userId.toString() === (req.user as { _id: string })._id.toString()) {
    await review.deleteOne();
    res.json({ message: 'Review removed' });  } else {
    res.status(403).json({ message: 'Not authorized to delete this review' });  }
};
