import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const FinancialSummary = ({ totalIncome, totalExpenses, balance, totalBudget, budgetUsed, settings }) => {
  const budgetRemaining = totalBudget - budgetUsed;
  const budgetPercentage = totalBudget > 0 ? (budgetUsed / totalBudget) * 100 : 0;

  return (
    <Row className="mb-4">
      <Col md={6} lg={3} className="mb-3">
        <Card className="h-100 income-card financial-card card-minimal hover-lift-minimal">
          <Card.Body className="spacing-minimal">
            <div className="card-icon icon-minimal">
              <i className="bi bi-arrow-up-circle"></i>
            </div>
            <div className="card-amount title-minimal">
              {settings.currency}{totalIncome.toFixed(2)}
            </div>
            <div className="card-label subtitle-minimal">Total Income</div>
            <small className="text-muted-soft">This month</small>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} lg={3} className="mb-3">
        <Card className="h-100 expense-card financial-card card-minimal hover-lift-minimal">
          <Card.Body className="spacing-minimal">
            <div className="card-icon icon-minimal">
              <i className="bi bi-arrow-down-circle"></i>
            </div>
            <div className="card-amount title-minimal">
              {settings.currency}{totalExpenses.toFixed(2)}
            </div>
            <div className="card-label subtitle-minimal">Total Expenses</div>
            <small className="text-muted-soft">This month</small>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} lg={3} className="mb-3">
        <Card className={`h-100 ${balance >= 0 ? 'savings-card' : 'expense-card'} financial-card card-minimal hover-lift-minimal`}>
          <Card.Body className="spacing-minimal">
            <div className="card-icon icon-minimal">
              <i className="bi bi-wallet2"></i>
            </div>
            <div className="card-amount title-minimal">
              {settings.currency}{balance.toFixed(2)}
            </div>
            <div className="card-label subtitle-minimal">Net Balance</div>
            <small className="text-muted-soft">Income - Expenses</small>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} lg={3} className="mb-3">
        <Card className="h-100 budget-card financial-card card-minimal hover-lift-minimal">
          <Card.Body className="spacing-minimal">
            <div className="card-icon icon-minimal">
              <i className="bi bi-pie-chart"></i>
            </div>
            <div className="card-amount title-minimal">
              {budgetPercentage.toFixed(1)}%
            </div>
            <div className="card-label subtitle-minimal">Budget Used</div>
            <small className="text-muted-soft">
              {settings.currency}{budgetRemaining.toFixed(2)} remaining
            </small>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default FinancialSummary;
