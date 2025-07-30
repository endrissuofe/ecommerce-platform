import React, { useState, useEffect } from 'react';
import { Product, productService, userService, orderService } from './services/api';
import './App.css';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await userService.register(email, password);
      setUser(response.data);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const placeOrder = async () => {
    if (!user || cart.length === 0) return;
    
    const total = cart.reduce((sum, product) => sum + product.price, 0);
    try {
      setLoading(true);
      await orderService.createOrder(user.id, cart, total);
      setCart([]);
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Order failed:', error);
      alert('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>E-Commerce Platform</h1>
        
        {!user && (
          <form onSubmit={handleRegister} style={{ margin: '20px 0' }}>
            <h2>Register</h2>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ margin: '5px', padding: '10px' }}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ margin: '5px', padding: '10px' }}
              />
            </div>
            <button type="submit" disabled={loading} style={{ margin: '10px', padding: '10px 20px' }}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}

        {user && (
          <div style={{ margin: '20px 0' }}>
            <p>Welcome, {user.email}!</p>
            <p>Cart items: {cart.length}</p>
            {cart.length > 0 && (
              <div>
                <p>Total: ${cart.reduce((sum, p) => sum + p.price, 0).toFixed(2)}</p>
                <button onClick={placeOrder} disabled={loading} style={{ padding: '10px 20px' }}>
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="products">
          <h2>Products</h2>
          {loading && <p>Loading products...</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', margin: '20px 0' }}>
            {products.map(product => (
              <div key={product.id} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>Category: {product.category}</p>
                {user && (
                  <button 
                    onClick={() => addToCart(product)}
                    style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;