import React, { useState } from 'react';
import { Row, Col, Card, Button, Form, Modal, ProgressBar, Alert } from 'react-bootstrap';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const Budget = ({ budgets, transactions, addBudget, updateBudget, deleteBudget, settings }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: 'food',
    amount: '',
    description: ''
  });

  const expenseCategories = ['food', 'transport', 'entertainment', 'books', 'housing', 'other'];
  
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Filter transactions for current month
  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.amount && formData.category) {
      if (editingBudget) {
        updateBudget(editingBudget.id, formData);
      } else {
        addBudget(formData);
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      category: 'food',
      amount: '',
      description: ''
    });
    setEditingBudget(null);
    setShowModal(false);
  };

  const handleEdit = (budget) => {
    setFormData({
      category: budget.category,
      amount: budget.amount,
      description: budget.description
    });
    setEditingBudget(budget);
    setShowModal(true);
  };

  const getBudgetData = (budget) => {
    const categoryExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const percentage = budget.amount > 0 ? (categoryExpenses / budget.amount) * 100 : 0;
    const remaining = budget.amount - categoryExpenses;
    
    return {
      spent: categoryExpenses,
      percentage: Math.min(percentage, 100),
      remaining,
      status: percentage > 100 ? 'danger' : percentage > 80 ? 'warning' : 'success'
    };
  };

  const getCategoryIcon = (category) => {
    const icons = {
      food: 'bi-cup-straw',
      transport: 'bi-bus-front',
      entertainment: 'bi-controller',
      books: 'bi-book',
      housing: 'bi-house',
      other: 'bi-three-dots'
    };
    return icons[category] || 'bi-three-dots';
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + parseFloat(budget.amount), 0);
  const totalSpent = budgets.reduce((sum, budget) => {
    const budgetData = getBudgetData(budget);
    return sum + budgetData.spent;
  }, 0);

  const availableCategories = expenseCategories.filter(cat => 
    !budgets.some(budget => budget.category === cat) || 
    (editingBudget && editingBudget.category === cat)
  );

  return (
    <div className="fade-in-up">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div className="page-header">
              <h1 className="text-primary page-title">
                <i className="bi bi-wallet2 me-3"></i>
                Budget Management
              </h1>
              <p className="text-muted">Set and track spending limits for different categories</p>
            </div>
            <Button 
              variant="primary" 
              className="btn-glow"
              onClick={() => setShowModal(true)}
              disabled={availableCategories.length === 0 && !editingBudget}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add Budget
            </Button>
          </div>
        </Col>
      </Row>

      {/* Budget Summary */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="budget-card glass-strong h-100">
            <Card.Body className="text-center">
              <div className="summary-icon mb-3">
                <i className="bi bi-piggy-bank"></i>
              </div>
              <h5 className="text-white-50 mb-2">Total Budget</h5>
              <h2 className="text-white mb-0">{settings.currency}{totalBudget.toFixed(2)}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="expense-card glass-strong h-100">
            <Card.Body className="text-center">
              <div className="summary-icon mb-3">
                <i className="bi bi-graph-down"></i>
              </div>
              <h5 className="text-white-50 mb-2">Total Spent</h5>
              <h2 className="text-white mb-0">{settings.currency}{totalSpent.toFixed(2)}</h2>
              <small className="text-white-50">
                {totalBudget > 0 ? `${((totalSpent / totalBudget) * 100).toFixed(1)}% of budget` : ''}
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Budget Categories */}
      {budgets.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <div className="empty-state-icon mb-4">
              <i className="bi bi-wallet2"></i>
            </div>
            <h4 className="text-white mb-3">No Budgets Created</h4>
            <p className="text-muted mb-4">
              Create your first budget to start tracking your spending by category
            </p>
            <Button variant="primary" className="btn-glow" onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-circle me-2"></i>
              Create Your First Budget
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {budgets.map((budget) => {
            const budgetData = getBudgetData(budget);
            return (
              <Col md={6} lg={4} key={budget.id}>
                <Card className="h-100 budget-item-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center">
                        <div className={`category-icon category-${budget.category} me-3`}>
                          <i className={`bi ${getCategoryIcon(budget.category)}`}></i>
                        </div>
                        <div>
                          <h5 className="mb-1 text-capitalize text-white">{budget.category}</h5>
                          {budget.description && (
                            <small className="text-muted">{budget.description}</small>
                          )}
                        </div>
                      </div>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-light"
                          size="sm"
                          className="btn-action"
                          onClick={() => handleEdit(budget)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="btn-action"
                          onClick={() => deleteBudget(budget.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-white-50">Spent</span>
                        <span className="fw-bold text-white">
                          {settings.currency}{budgetData.spent.toFixed(2)} / {settings.currency}{budget.amount}
                        </span>
                      </div>
                      <ProgressBar 
                        variant={budgetData.status}
                        now={budgetData.percentage}
                        className="enhanced-progress"
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <span className={`badge bg-${budgetData.status} enhanced-badge`}>
                        {budgetData.percentage.toFixed(1)}% used
                      </span>
                      <span className={`text-${budgetData.remaining >= 0 ? 'success' : 'danger'} fw-bold`}>
                        {budgetData.remaining >= 0 ? 'Remaining: ' : 'Over by: '}
                        {settings.currency}{Math.abs(budgetData.remaining).toFixed(2)}
                      </span>
                    </div>

                    {budgetData.percentage > 90 && (
                      <Alert variant={budgetData.status} className="mt-3 mb-0 small">
                        <i className="bi bi-exclamation-triangle me-1"></i>
                        {budgetData.percentage > 100 
                          ? 'Budget exceeded! Consider reviewing your spending.'
                          : 'Approaching budget limit. Monitor spending carefully.'
                        }
                      </Alert>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Student Budget Tips */}
      <Card className="mt-4 tips-card">
        <Card.Header className="tips-header">
          <h5 className="mb-0 text-white">
            <i className="bi bi-lightbulb me-2"></i>
            Student Budget Tips
          </h5>
        </Card.Header>
        <Card.Body>
          <Row className="g-4">
            <Col md={4}>
              <div className="tip-card text-center">
                <div className="tip-icon mb-3">
                  <i className="bi bi-cup-straw"></i>
                </div>
                <h6 className="text-white mb-2">Food Budget</h6>
                <small className="text-muted">
                  Cook at home and plan meals to save 30-50% on food expenses
                </small>
              </div>
            </Col>
            <Col md={4}>
              <div className="tip-card text-center">
                <div className="tip-icon mb-3">
                  <i className="bi bi-book"></i>
                </div>
                <h6 className="text-white mb-2">Books & Supplies</h6>
                <small className="text-muted">
                  Buy used books, rent, or use library resources to reduce costs
                </small>
              </div>
            </Col>
            <Col md={4}>
              <div className="tip-card text-center">
                <div className="tip-icon mb-3">
                  <i className="bi bi-controller"></i>
                </div>
                <h6 className="text-white mb-2">Entertainment</h6>
                <small className="text-muted">
                  Look for student discounts and free campus activities
                </small>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Add/Edit Budget Modal */}
      <Modal show={showModal} onHide={resetForm} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingBudget ? 'Edit Budget' : 'Add New Budget'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col xs={12}>
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                >
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat} className="text-capitalize">{cat}</option>
                  ))}
                </Form.Select>
                {availableCategories.length === 0 && !editingBudget && (
                  <Form.Text className="text-warning">
                    All categories have budgets. Edit an existing one or delete to create new.
                  </Form.Text>
                )}
              </Col>
              <Col xs={12}>
                <Form.Label>Monthly Budget Amount ({settings.currency})</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </Col>
              <Col xs={12}>
                <Form.Label>Description (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Budget notes..."
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingBudget ? 'Update Budget' : 'Add Budget'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Budget;
