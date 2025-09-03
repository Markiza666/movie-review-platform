import type{ Request, Response } from 'express';
import Review from '../models/Review.ts';
import Movie from '../models/Movie.ts';

import type{ AuthRequest } from '../interfaces/index.ts';

// @desc    Get all reviews for a movie
// @route   GET /api/reviews/movies/:movieId
// @access  Public
// This function doesn't require AuthRequest as it's a public route.
export const getMovieReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const reviews = await Review.find({ movieId: req.params.movieId }).populate('userId', 'username');
        if (!reviews) {
            res.status(404).json({ message: 'No reviews found for this movie' });
            return;
        }
        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new review
// @route   POST /api/reviews/:movieId
// @access  Private
export const createReview = async (req: AuthRequest, res: Response) => {
    const { rating, comment } = req.body;
    const { movieId } = req.params; 
    const userId = req.user?._id; 

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

// @desc    Update an existing review
// @route   PUT /api/reviews/:reviewId
// @access  Private
export const updateReview = async (req: AuthRequest, res: Response) => {
    const { rating, comment } = req.body;
    const reviewId = req.params.reviewId;
    const review = await Review.findById(reviewId);

    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }

    // Check that the logged-in user is the owner of the review
    if (review.userId.toString() !== req.user?._id?.toString()) { 
        return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    review.rating = rating !== undefined ? rating : review.rating;
    review.comment = comment !== undefined ? comment : review.comment;

    const updatedReview = await review.save();
    res.json(updatedReview);
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private
export const deleteReview = async (req: AuthRequest, res: Response) => {
    const reviewId = req.params.reviewId; 
    const review = await Review.findById(reviewId);
    
    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure the user is the owner of the review
    if (review.userId.toString() !== req.user?._id?.toString()) { 
        return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ message: 'Review removed' });
};
