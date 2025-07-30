const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// In-memory data store (replace with database in production)
let products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
  { id: 2, name: 'Phone', price: 599.99, category: 'Electronics' }
];

let users = [];
let orders = [];

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'E-commerce API is running' });
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const { name, price, category } = req.body;
  const newProduct = {
    id: products.length + 1,
    name,
    price: parseFloat(price),
    category
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.post('/api/users/register', (req, res) => {
  const { email, password } = req.body;
  const existingUser = users.find(u => u.email === email);
  
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  const newUser = {
    id: users.length + 1,
    email,
    password // In production, hash this password
  };
  
  users.push(newUser);
  res.status(201).json({ id: newUser.id, email: newUser.email });
});

app.post('/api/orders', (req, res) => {
  const { userId, products: orderProducts, total } = req.body;
  const newOrder = {
    id: orders.length + 1,
    userId,
    products: orderProducts,
    total,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;