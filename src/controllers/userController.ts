import  type{ Request, Response } from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

// Register a new user
const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ username, email, password, role });

  if (user) {
    // Correct way to handle the type of _id from a Mongoose Document
    const userId = (user._id as import('mongoose').Types.ObjectId).toString();

    res.status(201).json({
      _id: userId,
      username: user.username,
      email: user.email,
      token: generateToken(userId),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// Log in a user
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password!))) {
    const userId = (user._id as import('mongoose').Types.ObjectId).toString();

    res.json({
      _id: userId,
      username: user.username,
      email: user.email,
      token: generateToken(userId),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

export default { 
  registerUser, 
  loginUser 
};
