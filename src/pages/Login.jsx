import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Submitting login form with:', formData.email);
      const response = await authService.login(formData.email, formData.password);
      console.log('Login successful, full response:', response);
      console.log('Response role:', response.role);
      console.log('Role type:', typeof response.role);
      toast.success('Login successful!');
      
      // Redirect based on role - role is directly in response, not nested
      const userRole = response.role;
      console.log('Checking role for navigation:', userRole);
      
      if (userRole === 'AGENT') {
        console.log('Navigating to /agent');
        navigate('/agent');
      } else if (userRole === 'QA') {
        console.log('Navigating to /qa');
        navigate('/qa');
      } else {
        console.log('Unknown role:', userRole);
        toast.error(`Unknown role: ${userRole}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      toast.error(error.response?.data?.message || error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-right" />
      <div className="login-card">
        <div className="login-header">
          <h1>Call Audit System</h1>
          <p>Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Contact administrator if you need access</p>
        </div>
      </div>
    </div>
  );
}
