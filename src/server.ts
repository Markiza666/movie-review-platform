import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.ts';
import userRoutes from './routes/userRoutes.ts';
import reviewRoutes from './routes/reviewRoutes.ts';
import genreRoutes from './routes/genreRoutes.ts';
import movieRoutes from './routes/movieRoutes.ts';

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/genres', genreRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
