import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';

// ── GET /api/users (admin) ────────────────────────────────
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) { next(err); }
};

// ── GET /api/users/stats (admin) ──────────────────────────
export const getUserStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await userService.getUserStats();
    res.json(stats);
  } catch (err) { next(err); }
};

// ── GET /api/users/:id (admin) ────────────────────────────
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserWithOrders(req.params.id);
    res.json(user);
  } catch (err) { next(err); }
};

// ── PUT /api/users/profile (logged in user) ───────────────
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;
    if (!name && !email) {
      res.status(400).json({ message: 'Provide name or email to update' });
      return;
    }
    const user = await userService.updateUserProfile(req.userId, { name, email });
    res.json({ message: 'Profile updated', user });
  } catch (err) { next(err); }
};

// ── PUT /api/users/:id/role (admin) ──────────────────────
export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body;
    if (!['customer', 'admin'].includes(role)) {
      res.status(400).json({ message: 'Role must be customer or admin' });
      return;
    }
    const user = await userService.updateUserRole(req.params.id, role);
    res.json({ message: 'Role updated', user });
  } catch (err) { next(err); }
};

// ── DELETE /api/users/:id (admin) ────────────────────────
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.params.id === req.userId) {
      res.status(400).json({ message: 'Cannot delete your own account' });
      return;
    }
    const result = await userService.deleteUser(req.params.id);
    res.json(result);
  } catch (err) { next(err); }
};