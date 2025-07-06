import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const QuickStats = ({ transactions, settings }) => {
  // Calculate statistics
  const totalTransactions = transactions.length;
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const averageExpense = expenseTransactions.length > 0 
    ? expenseTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0) / expenseTransactions.length 
    : 0;

  // Most expensive category
  const categoryTotals = {};
  expenseTransactions.forEach(transaction => {
    const category = transaction.category;
    categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(transaction.amount);
  });

  const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
    categoryTotals[a] > categoryTotals[b] ? a : b, 'none'
  );

  const topCategoryAmount = categoryTotals[topCategory] || 0;

  // Daily average
  const days = Math.max(1, new Date().getDate());
  const dailyAverage = expenseTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0) / days;

  return (
    <Card className="quick-stats-card">
      <Card.Header className="chart-header">
        <h5 className="mb-0 text-white">
          <i className="bi bi-graph-up me-2"></i>Quick Stats
        </h5>
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          <Col xs={6}>
            <div className="stat-item text-center">
              <div className="stat-icon mb-2">
                <i className="bi bi-list-ul text-info" style={{fontSize: '2rem'}}></i>
              </div>
              <h4 className="text-white mb-1">{totalTransactions}</h4>
              <small className="text-muted">Transactions</small>
            </div>
          </Col>
          <Col xs={6}>
            <div className="stat-item text-center">
              <div className="stat-icon mb-2">
                <i className="bi bi-calculator text-warning" style={{fontSize: '2rem'}}></i>
              </div>
              <h4 className="text-white mb-1">{settings.currency}{averageExpense.toFixed(0)}</h4>
              <small className="text-muted">Avg Expense</small>
            </div>
          </Col>
          <Col xs={12}>
            <div className="stat-item text-center">
              <div className="stat-icon mb-2">
                <i className="bi bi-trophy text-success" style={{fontSize: '2rem'}}></i>
              </div>
              <h6 className="text-white mb-1 text-capitalize">{topCategory}</h6>
              <small className="text-muted">
                Top Category ({settings.currency}{topCategoryAmount.toFixed(2)})
              </small>
            </div>
          </Col>
          <Col xs={12}>
            <div className="stat-item text-center">
              <div className="stat-icon mb-2">
                <i className="bi bi-calendar3 text-primary" style={{fontSize: '2rem'}}></i>
              </div>
              <h4 className="text-white mb-1">{settings.currency}{dailyAverage.toFixed(2)}</h4>
              <small className="text-muted">Daily Average</small>
            </div>
          </Col>
        </Row>

        <div className="mt-4">
          <h6 className="text-white-50 mb-3">
            <i className="bi bi-lightbulb me-2"></i>Smart Tips
          </h6>
          <div className="tip-item">
            <div className="tip-icon-small me-2">
              <i className="bi bi-lightbulb-fill text-warning"></i>
            </div>
            <small className="text-white-50">
              {averageExpense > 50 
                ? "Consider tracking smaller expenses to identify saving opportunities!"
                : dailyAverage > 20
                ? "Great job! Try setting daily spending limits to save even more."
                : "Excellent spending control! Consider investing your savings."
              }
            </small>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default QuickStats;
