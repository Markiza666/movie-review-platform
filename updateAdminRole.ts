import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.ts'; 

dotenv.config();

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined in the .env file');
        }
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully...');
    } catch (error) {
        console.error(`Fel: ${error}`);
        process.exit(1);
    }
};

const updateAdminRole = async () => {
    await connectDB();
    
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: 'test@example.com' },
            { role: 'admin' },
            { new: true } 
        );

        if (updatedUser) {
            console.log('User role updated successfully!');
            console.log(updatedUser);
        } else {
            console.log('User not found.');
        }

    } catch (error) {
        console.error(`Error updating user: ${error}`);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
};

updateAdminRole();
