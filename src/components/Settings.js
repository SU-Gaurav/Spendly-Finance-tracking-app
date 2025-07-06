import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Alert, Modal } from 'react-bootstrap';

const Settings = ({ settings, setSettings }) => {
  const [formData, setFormData] = useState({
    ...settings,
    currency: settings.currency || '₹'
  });
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Update formData when settings prop changes
  useEffect(() => {
    setFormData({
      ...settings,
      currency: settings.currency || '₹'
    });
  }, [settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSettings(formData);
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    const defaultSettings = {
      currency: '₹',
      monthlyIncome: 0,
      studentStatus: 'undergraduate'
    };
    setFormData(defaultSettings);
    setSettings(defaultSettings);
    setShowResetModal(false);
    
    // Clear all data
    localStorage.removeItem('financeTransactions');
    localStorage.removeItem('financeBudgets');
    localStorage.removeItem('financeSettings');
    
    window.location.reload();
  };

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
    { value: 'A$', label: 'AUD (A$)' },
    { value: 'kr', label: 'SEK (kr)' },
    { value: 'Fr', label: 'CHF (Fr)' }
  ];

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary">
            <i className="bi bi-gear me-2"></i>
            Settings
          </h2>
          <p className="text-muted">Customize your Spendly preferences</p>
        </Col>
      </Row>

      {showSaveAlert && (
        <Alert variant="success" className="d-flex align-items-center">
          <i className="bi bi-check-circle me-2"></i>
          Settings saved successfully!
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-person-gear me-2"></i>
                Personal Preferences
              </h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>Currency</Form.Label>
                    <Form.Select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                    >
                      {currencies.map(currency => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Select your preferred currency for displaying amounts
                    </Form.Text>
                  </Col>

                  <Col md={6}>
                    <Form.Label>Student Status</Form.Label>
                    <Form.Select
                      name="studentStatus"
                      value={formData.studentStatus}
                      onChange={handleInputChange}
                    >
                      {studentStatuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      This helps provide relevant financial tips and advice
                    </Form.Text>
                  </Col>

                  <Col xs={12}>
                    <Form.Label>Monthly Income ({formData.currency})</Form.Label>
                    <Form.Control
                      type="number"
                      name="monthlyIncome"
                      value={formData.monthlyIncome}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                    <Form.Text className="text-muted">
                      Include all sources: scholarships, part-time jobs, allowances, etc.
                    </Form.Text>
                  </Col>

                  <Col xs={12}>
                    <div className="d-flex gap-2">
                      <Button variant="primary" type="submit">
                        <i className="bi bi-check-lg me-1"></i>
                        Save Settings
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        type="button"
                        onClick={() => setShowResetModal(true)}
                      >
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        Reset All Data
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                App Information
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-4">
                <i className="bi bi-piggy-bank text-primary" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-2">Spendly</h5>
                <p className="text-muted">Version 1.0.0</p>
              </div>

              <h6>Features:</h6>
              <ul className="list-unstyled">
                <li><i className="bi bi-check text-success me-2"></i>Transaction tracking</li>
                <li><i className="bi bi-check text-success me-2"></i>Budget management</li>
                <li><i className="bi bi-check text-success me-2"></i>Visual reports</li>
                <li><i className="bi bi-check text-success me-2"></i>Data persistence</li>
                <li><i className="bi bi-check text-success me-2"></i>Student-focused tips</li>
              </ul>

              <hr />

              <h6>Data Storage:</h6>
              <p className="small text-muted">
                All your data is stored locally in your browser. 
                No data is sent to external servers, ensuring your privacy.
              </p>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-lightbulb me-2"></i>
                Student Finance Tips
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="small">
                <h6>Quick Budgeting Tips:</h6>
                <ul className="mb-3">
                  <li>Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
                  <li>Track every expense for at least one month</li>
                  <li>Use student discounts whenever possible</li>
                  <li>Cook meals at home to save on food costs</li>
                </ul>

                <h6>Emergency Fund:</h6>
                <p className="mb-0">
                  Aim to save at least ₹5,000-10,000 for unexpected expenses. 
                  Even ₹500-1,000 per week can build up over time!
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reset Confirmation Modal */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Reset All Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
            <h5 className="mt-3">Are you sure?</h5>
            <p className="text-muted">
              This will permanently delete all your transactions, budgets, and settings. 
              This action cannot be undone.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleReset}>
            <i className="bi bi-trash me-1"></i>
            Reset All Data
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Settings;
