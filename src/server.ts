import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import movieRoutes from './routes/movieRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB ansluten...');
  } catch (error) {
    console.error(`Fel: ${error}`);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
