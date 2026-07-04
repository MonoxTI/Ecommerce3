import API from './api';

export const getCart = () => API.get('/cart').then(r => r.data);

export const addToCart = (data: { productId: string; size: string; color: string; quantity: number }) =>
  API.post('/cart', data).then(r => r.data);

export const updateCartItem = (data: { productId: string; size: string; color: string; quantity: number }) =>
  API.put('/cart/item', data).then(r => r.data);

export const removeFromCart = (data: { productId: string; size: string; color: string }) =>
  API.delete('/cart/item', { data }).then(r => r.data);

export const clearCart = () => API.delete('/cart').then(r => r.data);