import API from './api';

export const getProducts = (params?: Record<string, any>) =>
  API.get('/products', { params }).then(r => r.data);

export const getProduct = (id: string) =>
  API.get(`/products/${id}`).then(r => r.data);

export const getProductsByCategory = (category: string) =>
  API.get(`/products/category/${category}`).then(r => r.data);

export const createProduct = (data: FormData) =>
  API.post('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);

export const updateProduct = (id: string, data: any) =>
  API.put(`/products/${id}`, data).then(r => r.data);

export const deleteProduct = (id: string) =>
  API.delete(`/products/${id}`).then(r => r.data);