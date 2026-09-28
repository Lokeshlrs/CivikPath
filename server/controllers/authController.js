import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'civicpath_secret_jwt_key_phase2_demo';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, location } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const dbHost = User.db?.host || 'unknown-host';
    const dbName = User.db?.name || 'unknown-db';

    console.log(`[Auth Diagnostic] Registration attempt | DB Host: ${dbHost} | DB Name: ${dbName} | Collection: users | Target Email: ${normalizedEmail}`);

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.log(`[Auth Diagnostic] Registration rejected — user already exists | Email: ${normalizedEmail} | UserID: ${existingUser._id}`);
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email address',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      role: role === 'admin' ? 'admin' : 'citizen',
      location: location || { state: 'Maharashtra', district: 'Amravati', city: 'Amravati' },
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return res.json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};
