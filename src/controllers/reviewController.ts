import type { Response } from 'express';
import { IReview, IMovie } from '../interfaces/index.ts';   // Ensures clarity on the relationship between models and interfaces. Imported for type safety and future scalability.
import Review from '../models/review.ts';
import Movie from '../models/movie.ts';
import type { AuthRequest } from '../middleware/authMiddleware.ts';

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
export const createMovieReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { rating, comment, movieId } = req.body;

        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        const movie = await Movie.findById(movieId);
        if (!movie) {
            res.status(404).json({ message: 'Movie not found' });
            return;
        }

        const review = await Review.create({
            rating,
            comment,
            userId: req.user._id,
            movieId: movieId
        });

        await Movie.findByIdAndUpdate(movieId, {
            $push: { reviews: review._id }
        });

        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get reviews for a specific movie
// @route   GET /api/reviews/movie/:id
// @access  Public
export const getMovieReviews = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const reviews = await Review.find({ movie: req.params.id })
            .populate('userId', 'username');

        if (!reviews) {
            res.status(404).json({ message: 'No reviews found for this movie' });
            return;
        }
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            res.status(404).json({ message: 'Review not found' });
            return;
        }

        const isOwner = review.userId.toString() === req.user?._id.toString();
        const isAdmin = req.user?.role === 'admin';

        if (!isOwner && !isAdmin) {
            res.status(403).json({ message: 'Not authorized to update this review' });
            return;
        }

        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            res.status(404).json({ message: 'Review not found' });
            return;
        }

        // Check if owner of the review or admin
        const isOwner = review.userId.toString() === req.user?._id.toString();
        const isAdmin = req.user?.role === 'admin';

        if (!isOwner && !isAdmin) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }

        await Movie.findByIdAndUpdate(review.movieId, {
            $pull: { reviews: review._id }
        });

        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all reviews (Admin or Debug)
// @route   GET /api/reviews
export const getAllReviews = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const reviews = await Review.find({}).populate('movie', 'title');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single review by ID
// @route   GET /api/reviews/:id
export const getReviewById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('userId', 'username')
            .populate('movieId', 'title');

        if (!review) {
            res.status(404).json({ message: 'Review not found' });
            return;
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
