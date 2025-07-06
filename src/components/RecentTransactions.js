import React from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const RecentTransactions = ({ transactions, settings }) => {
  const navigate = useNavigate();

  const getCategoryIcon = (category) => {
    const icons = {
      food: 'bi-cup-straw',
      transport: 'bi-bus-front',
      entertainment: 'bi-controller',
      books: 'bi-book',
      housing: 'bi-house',
      income: 'bi-cash-coin',
      other: 'bi-three-dots'
    };
    return icons[category] || 'bi-three-dots';
  };

  const getCategoryColor = (category) => {
    const colors = {
      food: 'category-food',
      transport: 'category-transport',
      entertainment: 'category-entertainment',
      books: 'category-books',
      housing: 'category-housing',
      income: 'category-income',
      other: 'category-other'
    };
    return colors[category] || 'category-other';
  };

  return (
    <Card className="recent-transactions-card">
      <Card.Header className="d-flex justify-content-between align-items-center chart-header">
        <h5 className="mb-0 text-white">
          <i className="bi bi-clock-history me-2"></i>
          Recent Transactions
        </h5>
        <Button 
          variant="outline-light" 
          size="sm"
          className="btn-action"
          onClick={() => navigate('/transactions')}
        >
          <i className="bi bi-arrow-right me-1"></i>
          View All
        </Button>
      </Card.Header>
      <Card.Body className="p-0">
        {transactions.length === 0 ? (
          <div className="empty-chart-state">
            <div className="empty-state-icon mb-3">
              <i className="bi bi-receipt"></i>
            </div>
            <p className="text-muted mt-2 mb-2">No transactions yet</p>
            <small className="text-muted">Start tracking your finances by adding a transaction</small>
          </div>
        ) : (
          <ListGroup variant="flush">
            {transactions.map((transaction) => (
              <ListGroup.Item key={transaction.id} className="transaction-item">
                <div className="d-flex align-items-center">
                  <div className={`category-icon me-3 ${getCategoryColor(transaction.category)}`}>
                    <i className={`bi ${getCategoryIcon(transaction.category)}`}></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1 text-white">{transaction.description}</h6>
                        <small className="text-muted">
                          <span className="text-capitalize">{transaction.category}</span> • {format(new Date(transaction.date), 'MMM dd, yyyy')}
                        </small>
                      </div>
                      <div className="text-end">
                        <span className={`fw-bold ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
                          {transaction.type === 'income' ? '+' : '-'}{settings.currency}{parseFloat(transaction.amount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default RecentTransactions;
