import type { Response } from 'express';
import { IReview, IMovie } from '../interfaces/index.ts';   // Ensures clarity on the relationship between models and interfaces. Imported for type safety and future scalability.
import Review from '../models/review.ts';
import Movie from '../models/movie.ts';
import type { AuthRequest } from '../middleware/authMiddleware.ts';

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

export const getMovieReviews = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const reviews = await Review.find({ movieId: req.params.id })
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

export const updateReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            res.status(404).json({ message: 'Review not found' });
            return;
        }

        // OWNERSHIP CHECK: Compare the review's userId with the logged in user's ID
        if (review.userId.toString() !== req.user?._id.toString()) {
            res.status(403).json({ message: 'You can only update your own reviews.' });
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

export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            res.status(404).json({ message: 'Review not found' });
            return;
        }

        // OWNERSHIP CHECK: Only the owner can delete
        if (review.userId.toString() !== req.user?._id.toString()) {
            res.status(403).json({ message: 'Not authorized to delete this review.' });
            return;
        }

        // Remove the reference from the Movie's review array
        await Movie.findByIdAndUpdate(review.movieId, {
            $pull: { reviews: review._id }
        });

        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllReviews = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const reviews = await Review.find({})
            .populate('movieId', 'title')
            .populate('userId', 'username');
            
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

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
