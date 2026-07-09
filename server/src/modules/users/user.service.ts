import { User } from '../auth/auth.model';
import { Order } from '../orders/order.model';

// ── Get All Users (admin) ─────────────────────────────────
export const getAllUsers = async () => {
  return User.findAll({
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']],
  });
};

// ── Get Single User ───────────────────────────────────────
export const getUserById = async (id: string) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
  });
  if (!user) throw new Error('User not found');
  return user;
};

// ── Get User with Order History ───────────────────────────
export const getUserWithOrders = async (id: string) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
  });
  if (!user) throw new Error('User not found');

  const orders = await Order.findAll({
    where: { userId: id },
    order: [['createdAt', 'DESC']],
  });

  return { user, orders, orderCount: orders.length };
};

// ── Update User Profile ───────────────────────────────────
export const updateUserProfile = async (
  id: string,
  data: { name?: string; email?: string }
) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');

  if (data.email && data.email !== user.email) {
    const existing = await User.findOne({ where: { email: data.email } });
    if (existing) throw new Error('Email already in use');
  }

  await user.update(data);

  const { password: _, ...userWithoutPassword } = user.toJSON() as any;
  return userWithoutPassword;
};

// ── Update User Role (admin) ──────────────────────────────
export const updateUserRole = async (id: string, role: 'customer' | 'admin') => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  await user.update({ role });
  const { password: _, ...userWithoutPassword } = user.toJSON() as any;
  return userWithoutPassword;
};

// ── Delete User (admin) ───────────────────────────────────
export const deleteUser = async (id: string) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  await user.destroy();
  return { message: 'User deleted successfully' };
};

// ── Get User Stats (admin dashboard) ─────────────────────
export const getUserStats = async () => {
  const total = await User.count();
  const admins = await User.count({ where: { role: 'admin' } });
  const customers = await User.count({ where: { role: 'customer' } });
  return { total, admins, customers };
};