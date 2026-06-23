import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './auth.model';
import { env } from '../../config/env';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const registerUser = async ({ name, email, password }: RegisterInput) => {
  // 1. Check if email already exists
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new Error('Email already registered');
  }

  // 2. Hash the password (never store plain text)
  const hashedPassword = await bcrypt.hash(password, 12);

  // 3. Create user in DB
  const user = await User.create({ name, email, password: hashedPassword });

  // 4. Generate JWT
  const token = generateToken(user.id, user.role);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const loginUser = async ({ email, password }: LoginInput) => {
  // 1. Find user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // 2. Compare password with stored hash
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password'); // same message — don't reveal which field is wrong
  }

  // 3. Generate JWT
  const token = generateToken(user.id, user.role);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const getProfile = async (userId: string) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }, // never return password
  });
  if (!user) throw new Error('User not found');
  return user;
};