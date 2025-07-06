import React, { useState } from 'react';

import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { EmailIcon, PasswordIcon } from './InputIcon';

const Login = ({ onSwitchToRegister, isTransitioning }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email or username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setErrors({ general: result.error });
    }
    
    setLoading(false);
  };



  return (
    <motion.div 
      className="auth-card-advanced"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="auth-header-advanced">
        <motion.div 
          className="logo"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
        >
          <i className="bi bi-piggy-bank"></i>
        </motion.div>
        <motion.h2 
          className="mb-0 title-minimal"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Welcome Back!
        </motion.h2>
        <motion.p 
          className="mb-0 subtitle-minimal"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Sign in to Spendly
        </motion.p>
      </div>
      
      <div className="auth-body-advanced">
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="danger" className="mb-3">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {errors.general}
            </Alert>
          </motion.div>
        )}

        <Form onSubmit={handleSubmit}>
          <motion.div 
            className="floating-label-advanced"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="icon-input-wrapper">
              <Form.Control
                type="text"
                name="email"
                placeholder="Email or Username"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                disabled={loading || isTransitioning}
                className="icon-input-field with-icon"
              />
              <span className="input-field-icon">
                <EmailIcon />
              </span>
            </div>
            {errors.email && (
              <div className="invalid-feedback d-block">
                {errors.email}
              </div>
            )}
          </motion.div>

          <motion.div 
            className="floating-label-advanced"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="icon-input-wrapper">
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
                disabled={loading || isTransitioning}
                className="icon-input-field with-icon"
              />
              <span className="input-field-icon">
                <PasswordIcon />
              </span>
            </div>
            {errors.password && (
              <div className="invalid-feedback d-block">
                {errors.password}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Button 
              type="submit" 
              className="auth-btn-advanced"
              disabled={loading || isTransitioning}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Signing In...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Sign In
                </>
              )}
            </Button>
          </motion.div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <span className="text-muted-soft">Don't have an account? </span>
            <button 
              type="button"
              className="auth-link"
              onClick={onSwitchToRegister}
              disabled={loading || isTransitioning}
              style={{ background: 'none', border: 'none' }}
            >
              Sign up here
            </button>
          </motion.div>
        </Form>
      </div>
    </motion.div>
  );
};

export default Login;
