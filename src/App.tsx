import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const { user, loading, login, logout, isAuthenticated, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h1>Wingman Protocol App</h1>
      {loading && <p>Loading...</p>}
      {error && <div style={{ color: 'red' }}><p>{error.message}</p></div>}
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.email}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ display: 'block', marginBottom: 8, width: '100%' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ display: 'block', marginBottom: 8, width: '100%' }}
          />
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default App;
