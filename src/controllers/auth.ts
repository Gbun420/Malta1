import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import * as userRepository from '../repositories/user.repository';
import * as analytics from '../services/analytics.service';
import { problemDetails } from '../utils/problemDetails';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).type('application/problem+json').json(
        problemDetails(
          400,
          'https://http.dev/problems/bad-request',
          'Bad Request',
          'Email and password are required',
          req.originalUrl
        )
      );
    }

    // Check if user already exists
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).type('application/problem+json').json(
        problemDetails(
          409,
          'https://http.dev/problems/conflict',
          'Conflict',
          'User with this email already exists',
          req.originalUrl
        )
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Use cost factor 12
    const user = await userRepository.createUser({ email, password_hash: hashedPassword });

    // Send only userId to analytics, not email
    analytics.trackEvent('user_signup', { userId: user.id });

    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (error: any) {
    console.error('Error registering user:', error);
    res.status(500).type('application/problem+json').json(
      problemDetails(
        500,
        'https://http.dev/problems/internal-server-error',
        'Internal Server Error',
        error.message || 'An unexpected error occurred',
        req.originalUrl
      )
    );
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).type('application/problem+json').json(
        problemDetails(
          400,
          'https://http.dev/problems/bad-request',
          'Bad Request',
          'Email and password are required',
          req.originalUrl
        )
      );
    }

    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      // Don't reveal if user exists or not to prevent user enumeration
      return res.status(401).type('application/problem+json').json(
        problemDetails(
          401,
          'https://http.dev/problems/unauthorized',
          'Unauthorized',
          'Invalid credentials',
          req.originalUrl
        )
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).type('application/problem+json').json(
        problemDetails(
          401,
          'https://http.dev/problems/unauthorized',
          'Unauthorized',
          'Invalid credentials',
          req.originalUrl
        )
      );
    }

    // Ensure JWT_SECRET is defined
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Create JWT with explicit algorithm and claims
    const token = jwt.sign(
      { 
        sub: String(user.id), 
        jti: crypto.randomUUID(),
        aud: 'your-web',
        iss: 'your-app'
      },
      secret,
      { 
        algorithm: 'HS256', 
        expiresIn: '1h',
      }
    );

    // Set secure cookie options
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 1000 // 1 hour
    });
    
    // Don't return token in response body
    return res.status(200).json({ message: 'Logged in' });
  } catch (error: any) {
    console.error('Error logging in:', error);
    res.status(500).type('application/problem+json').json(
      problemDetails(
        500,
        'https://http.dev/problems/internal-server-error',
        'Internal Server Error',
        error.message || 'An unexpected error occurred',
        req.originalUrl
      )
    );
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
  res.status(200).json({ message: 'Logged out' });
};