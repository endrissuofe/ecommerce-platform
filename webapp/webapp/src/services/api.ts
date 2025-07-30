import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export interface User {
  id: number;
  email: string;
}

export interface Order {
  id: number;
  userId: number;
  products: Product[];
  total: number;
  status: string;
  createdAt: string;
}

export const productService = {
  getProducts: () => api.get<Product[]>('/api/products'),
  createProduct: (product: Omit<Product, 'id'>) => 
    api.post<Product>('/api/products', product),
};

export const userService = {
  register: (email: string, password: string) =>
    api.post<User>('/api/users/register', { email, password }),
};

export const orderService = {
  createOrder: (userId: number, products: Product[], total: number) =>
    api.post<Order>('/api/orders', { userId, products, total }),
};