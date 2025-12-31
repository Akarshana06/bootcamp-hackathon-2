import { Router, type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env';
import { catchAsync } from '../middleware/errorHandler';

// Input validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name is required'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type UserPayload = {
  id: string;
  email: string;
  role: string;
};

// Generate JWT token
const generateToken = (payload: UserPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });
};

export const createAuthRouter = (prisma: PrismaClient) => {
  const router = Router();

  // Register a new user
  router.post(
    '/register',
    catchAsync(async (req: Request, res: Response) => {
      const { email, password, name } = registerSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already in use',
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Return user data (excluding password)
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({
        status: 'success',
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    })
  );

  // Login user
  router.post(
    '/login',
    catchAsync(async (req: Request, res: Response) => {
      const { email, password } = loginSchema.parse(req.body);

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials',
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials',
        });
      }

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Return user data (excluding password)
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        status: 'success',
        data: {
          user: userWithoutPassword,
          token,
        },
      });
    })
  );

  // Get current user (protected route)
  router.get(
    '/me',
    catchAsync(async (req: Request, res: Response) => {
      // The auth middleware will have attached the user to the request
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Not authenticated',
        });
      }

      // Get fresh user data from database
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json({
        status: 'success',
        data: {
          user: currentUser,
        },
      });
    })
  );

  return router;
};
