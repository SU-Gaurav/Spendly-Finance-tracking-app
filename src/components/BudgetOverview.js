import React from 'react';
import { Card, Row, Col, ProgressBar, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const BudgetOverview = ({ budgets, transactions, settings }) => {
  const navigate = useNavigate();

  const getBudgetData = (budget) => {
    const categoryExpenses = transactions
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

  return (
    <Card className="budget-overview-card">
      <Card.Header className="d-flex justify-content-between align-items-center chart-header">
        <h5 className="mb-0 text-white">
          <i className="bi bi-pie-chart me-2"></i>
          Budget Overview
        </h5>
        <Button 
          variant="outline-light" 
          size="sm"
          className="btn-action"
          onClick={() => navigate('/budget')}
        >
          <i className="bi bi-gear me-1"></i>
          Manage Budget
        </Button>
      </Card.Header>
      <Card.Body>
        {budgets.length === 0 ? (
          <div className="empty-chart-state">
            <div className="empty-state-icon mb-3">
              <i className="bi bi-wallet2"></i>
            </div>
            <p className="text-muted mt-2 mb-2">No budgets set</p>
            <small className="text-muted">Create budgets to track your spending by category</small>
            <div className="mt-3">
              <Button 
                variant="primary" 
                size="sm"
                className="btn-glow"
                onClick={() => navigate('/budget')}
              >
                <i className="bi bi-plus-circle me-1"></i>
                Create Budget
              </Button>
            </div>
          </div>
        ) : (
          <Row className="g-3">
            {budgets.map((budget) => {
              const budgetData = getBudgetData(budget);
              return (
                <Col md={6} lg={4} key={budget.id}>
                  <div className="budget-overview-item">
                    <div className="d-flex align-items-center mb-3">
                      <div className={`category-icon category-${budget.category} me-3`}>
                        <i className={`bi ${getCategoryIcon(budget.category)}`}></i>
                      </div>
                      <h6 className="mb-0 text-capitalize text-white">{budget.category}</h6>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between small text-white-50 mb-2">
                        <span>Spent: {settings.currency}{budgetData.spent.toFixed(2)}</span>
                        <span>Budget: {settings.currency}{budget.amount}</span>
                      </div>
                      <ProgressBar 
                        variant={budgetData.status}
                        now={budgetData.percentage}
                        className="enhanced-progress"
                      />
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <small className={`badge bg-${budgetData.status} enhanced-badge`}>
                        {budgetData.percentage.toFixed(1)}% used
                      </small>
                      <small className={`text-${budgetData.remaining >= 0 ? 'success' : 'danger'} fw-bold`}>
                        {budgetData.remaining >= 0 ? 'Remaining: ' : 'Over by: '}
                        {settings.currency}{Math.abs(budgetData.remaining).toFixed(2)}
                      </small>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default BudgetOverview;
