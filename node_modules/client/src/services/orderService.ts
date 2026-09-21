import API from './api';

export const placeOrder = (data: any) =>
  API.post('/orders', data).then(r => r.data);

export const getMyOrders = () =>
  API.get('/orders').then(r => r.data);

export const getOrder = (id: string) =>
  API.get(`/orders/${id}`).then(r => r.data);

export const cancelOrder = (id: string, cancelReason: string) =>
  API.put(`/orders/${id}/cancel`, { cancelReason }).then(r => r.data);

// Admin
export const getAllOrders = (status?: string) =>
  API.get('/orders/admin/all', { params: { status } }).then(r => r.data);

export const updateOrderStatus = (id: string, data: { status: string; trackingNumber?: string }) =>
  API.put(`/orders/admin/${id}`, data).then(r => r.data);