import API from './api';

export const register = (data: { name: string; email: string; password: string }) =>
  API.post('/auth/register', data).then(r => r.data);

export const login = (data: { email: string; password: string }) =>
  API.post('/auth/login', data).then(r => r.data);

export const getMe = () =>
  API.get('/auth/me').then(r => r.data);