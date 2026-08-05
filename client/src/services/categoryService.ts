import API from './api';

export const getCategories = () =>
  API.get('/categories').then(r => r.data);

export const getAdminCategories = () =>
  API.get('/categories?all=true').then(r => r.data);

export const createCategory = (data: FormData) =>
  API.post('/categories', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);

export const updateCategory = (id: string, data: FormData) =>
  API.put(`/categories/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);

export const deleteCategory = (id: string) =>
  API.delete(`/categories/${id}`).then(r => r.data);