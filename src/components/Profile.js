import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Alert, Modal, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const Profile = () => {
  const { user, updateProfile, logout, deleteAccount } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    studentStatus: user?.studentStatus || 'undergraduate',
    preferences: {
      currency: user?.preferences?.currency || '₹',
      monthlyIncome: user?.preferences?.monthlyIncome || 0,
      theme: user?.preferences?.theme || 'default'
    }
  });

  const studentStatuses = [
    { value: 'high-school', label: 'High School Student' },
    { value: 'undergraduate', label: 'Undergraduate Student' },
    { value: 'graduate', label: 'Graduate Student' },
    { value: 'part-time', label: 'Part-time Student' },
    { value: 'online', label: 'Online Student' }
  ];

  const currencies = [
    { value: '₹', label: 'INR (₹)' },
    { value: '$', label: 'USD ($)' },
    { value: '€', label: 'EUR (€)' },
    { value: '£', label: 'GBP (£)' },
    { value: '¥', label: 'JPY (¥)' },
    { value: 'C$', label: 'CAD (C$)' },
    { value: 'A$', label: 'AUD (A$)' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: prefKey === 'monthlyIncome' ? parseFloat(value) || 0 : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = () => {
    const updatedData = {
      ...formData,
      avatar: `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase()
    };
    updateProfile(updatedData);
    setIsEditing(false);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      email: user?.email || '',
      studentStatus: user?.studentStatus || 'undergraduate',
      preferences: {
        currency: user?.preferences?.currency || '₹',
        monthlyIncome: user?.preferences?.monthlyIncome || 0,
        theme: user?.preferences?.theme || 'default'
      }
    });
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    setShowDeleteModal(false);
  };

  const getStudentStatusLabel = (status) => {
    const statusObj = studentStatuses.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  };

  const getCurrencyLabel = (currency) => {
    const currencyObj = currencies.find(c => c.value === currency);
    return currencyObj ? currencyObj.label : currency;
  };

  if (!user) return null;

  return (
    <div className="fade-in-up">
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary">
            <i className="bi bi-person-circle me-2"></i>
            My Profile
          </h2>
          <p className="text-muted">Manage your account settings and preferences</p>
        </Col>
      </Row>

      {showSuccessAlert && (
        <Alert variant="success" className="d-flex align-items-center mb-4">
          <i className="bi bi-check-circle me-2"></i>
          Profile updated successfully!
        </Alert>
      )}

      <Row>
        <Col lg={4}>
          <Card className="profile-card mb-4">
            <Card.Body className="text-center">
              <div className="profile-avatar">
                {user.avatar}
              </div>
              <h4 className="mb-1">{user.firstName} {user.lastName}</h4>
              <p className="mb-2 opacity-75">@{user.username}</p>
              <Badge bg="light" text="dark" className="mb-3">
                {getStudentStatusLabel(user.studentStatus)}
              </Badge>
              <div className="d-flex justify-content-center gap-2">
                {!isEditing ? (
                  <Button 
                    variant="light" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="bi bi-pencil me-1"></i>
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="light" 
                      size="sm"
                      onClick={handleSave}
                    >
                      <i className="bi bi-check me-1"></i>
                      Save
                    </Button>
                    <Button 
                      variant="outline-light" 
                      size="sm"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Account Information
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <small className="text-muted">Member Since</small>
                <div className="fw-bold">
                  {format(new Date(user.createdAt), 'MMMM dd, yyyy')}
                </div>
              </div>
              <div className="mb-3">
                <small className="text-muted">User ID</small>
                <div className="fw-bold font-monospace small">
                  {user.id}
                </div>
              </div>
              <div className="mb-3">
                <small className="text-muted">Preferred Currency</small>
                <div className="fw-bold">
                  {getCurrencyLabel(user.preferences?.currency)}
                </div>
              </div>
              <div>
                <small className="text-muted">Monthly Income</small>
                <div className="fw-bold">
                  {user.preferences?.currency}{user.preferences?.monthlyIncome || 0}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-gear me-2"></i>
                Profile Settings
              </h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Student Status</Form.Label>
                    <Form.Select
                      name="studentStatus"
                      value={formData.studentStatus}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      {studentStatuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label>Preferred Currency</Form.Label>
                    <Form.Select
                      name="preferences.currency"
                      value={formData.preferences.currency}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      {currencies.map(currency => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col xs={12}>
                    <Form.Label>Monthly Income ({formData.preferences.currency})</Form.Label>
                    <Form.Control
                      type="number"
                      name="preferences.monthlyIncome"
                      value={formData.preferences.monthlyIncome}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      step="0.01"
                      min="0"
                    />
                    <Form.Text className="text-muted">
                      Include all sources: scholarships, part-time jobs, allowances, etc.
                    </Form.Text>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          <Card className="mt-4">
            <Card.Header>
              <h5 className="mb-0 text-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Danger Zone
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Delete Account</h6>
                  <small className="text-muted">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </small>
                </div>
                <Button 
                  variant="outline-danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <i className="bi bi-trash me-1"></i>
                  Delete Account
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card className="mt-4">
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-box-arrow-right me-2"></i>
                Session Management
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Sign Out</h6>
                  <small className="text-muted">
                    Sign out of your account on this device.
                  </small>
                </div>
                <Button 
                  variant="outline-secondary"
                  onClick={logout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Sign Out
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Account Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
            <h5 className="mt-3 mb-3">Are you absolutely sure?</h5>
            <p className="text-muted">
              This will permanently delete your account, including:
            </p>
            <ul className="text-start text-muted">
              <li>All transactions and financial data</li>
              <li>Budget settings and preferences</li>
              <li>Profile information</li>
              <li>App settings and customizations</li>
            </ul>
            <Alert variant="danger" className="mt-3">
              <strong>This action cannot be undone!</strong>
            </Alert>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            <i className="bi bi-trash me-1"></i>
            Delete My Account
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
