import React, { useState } from 'react';
import { Button, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, AtIcon, MailIcon, GraduationIcon, PasswordIcon, ConfirmPasswordIcon } from './InputIcon';

const Register = ({ onSwitchToLogin, isTransitioning }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentStatus: 'undergraduate'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const studentStatuses = [
    { value: 'high-school', label: 'High School Student' },
    { value: 'undergraduate', label: 'Undergraduate Student' },
    { value: 'graduate', label: 'Graduate Student' },
    { value: 'part-time', label: 'Part-time Student' },
    { value: 'online', label: 'Online Student' }
  ];

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    const result = await register(formData);
    
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
          <i className="bi bi-person-plus"></i>
        </motion.div>
        <motion.h2 
          className="mb-0 title-minimal"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Join Us!
        </motion.h2>
        <motion.p 
          className="mb-0 subtitle-minimal"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Create your Spendly account
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
          <Row>
            <Col md={6}>
              <motion.div 
                className="floating-label-advanced"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="icon-input-wrapper">
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    isInvalid={!!errors.firstName}
                    disabled={loading || isTransitioning}
                    className="icon-input-field with-icon"
                  />
                  <span className="input-field-icon">
                    <UserIcon />
                  </span>
                </div>
                {errors.firstName && (
                  <div className="invalid-feedback d-block">
                    {errors.firstName}
                  </div>
                )}
              </motion.div>
            </Col>
            <Col md={6}>
              <motion.div 
                className="floating-label-advanced"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="icon-input-wrapper">
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    isInvalid={!!errors.lastName}
                    disabled={loading || isTransitioning}
                    className="icon-input-field with-icon"
                  />
                  <span className="input-field-icon">
                    <UserIcon />
                  </span>
                </div>
                {errors.lastName && (
                  <div className="invalid-feedback d-block">
                    {errors.lastName}
                  </div>
                )}
              </motion.div>
            </Col>
          </Row>

          <motion.div 
            className="floating-label-advanced"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="icon-input-wrapper">
              <Form.Control
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                isInvalid={!!errors.username}
                disabled={loading || isTransitioning}
                className="icon-input-field with-icon"
              />
              <span className="input-field-icon">
                <AtIcon />
              </span>
            </div>
            {errors.username && (
              <div className="invalid-feedback d-block">
                {errors.username}
              </div>
            )}
          </motion.div>

          <motion.div 
            className="floating-label-advanced"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="icon-input-wrapper">
              <Form.Control
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                disabled={loading || isTransitioning}
                className="icon-input-field with-icon"
              />
              <span className="input-field-icon">
                <MailIcon />
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
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="icon-input-wrapper">
              <Form.Select
                name="studentStatus"
                value={formData.studentStatus}
                onChange={handleChange}
                disabled={loading || isTransitioning}
                className="icon-select-field with-icon"
              >
                {studentStatuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </Form.Select>
              <span className="input-field-icon">
                <GraduationIcon />
              </span>
            </div>
          </motion.div>

          <motion.div 
            className="floating-label-advanced"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
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
            className="floating-label-advanced"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <div className="icon-input-wrapper">
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                isInvalid={!!errors.confirmPassword}
                disabled={loading || isTransitioning}
                className="icon-input-field with-icon"
              />
              <span className="input-field-icon">
                <ConfirmPasswordIcon />
              </span>
            </div>
            {errors.confirmPassword && (
              <div className="invalid-feedback d-block">
                {errors.confirmPassword}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            <Button 
              type="submit" 
              className="auth-btn-advanced"
              disabled={loading || isTransitioning}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus me-2"></i>
                  Create Account
                </>
              )}
            </Button>
          </motion.div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <span className="text-muted-soft">Already have an account? </span>
            <button 
              type="button"
              className="auth-link"
              onClick={onSwitchToLogin}
              disabled={loading || isTransitioning}
              style={{ background: 'none', border: 'none' }}
            >
              Sign in here
            </button>
          </motion.div>
        </Form>
      </div>
    </motion.div>
  );
};

export default Register;
