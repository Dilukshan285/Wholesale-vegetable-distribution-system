import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QAteamLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch('http://localhost:3001/QAteam/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Response:', data); // Debugging

      if (data.message === 'Login successful') {
        navigate('/qa-team'); // Navigate to the QA Team dashboard
      } else {
        setError(data.message); // Set error message from backend
      }
    } catch (err) {
      console.error('Error:', err); // Debugging
      setError('Failed to login. Please check your credentials.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f4f8]">
      <h2 className="text-4xl font-bold mb-6 text-[#11532F]">QA Team Login</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-96"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>
        <div className="flex justify-between items-center">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <button
              type="submit"
              className="bg-[#58ab31] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#4a9c28] transition"
            >
              Login
            </button>
          )}
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
  
};

export default QAteamLogin;
